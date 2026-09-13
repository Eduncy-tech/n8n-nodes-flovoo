import { createHmac, timingSafeEqual } from 'crypto';

import type {
  IHookFunctions,
  IWebhookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookResponseData,
  IDataObject,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

const SIGNATURE_TOLERANCE_SECONDS = 300;

function verifySignature(header: string | undefined, rawBody: string, secret: string): boolean {
  if (!header) return false;

  const parts = Object.fromEntries(
    header.split(',').map((part) => {
      const [key, value] = part.split('=');
      return [key, value];
    }),
  );

  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) return false;

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > SIGNATURE_TOLERANCE_SECONDS) return false;

  const expected = createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex');

  const expectedBuffer = Buffer.from(expected, 'hex');
  const signatureBuffer = Buffer.from(signature, 'hex');
  if (expectedBuffer.length !== signatureBuffer.length) return false;

  return timingSafeEqual(expectedBuffer, signatureBuffer);
}

export class FlovooTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Flovoo Trigger',
    name: 'flovooTrigger',
    icon: 'file:icons/flovoo.png',
    group: ['trigger'],
    version: 1,
    description:
      'Trigger workflows on Flovoo events — new messages, contact updates, and template status changes.',
    defaults: { name: 'Flovoo Trigger' },
    inputs: [],
    outputs: [NodeConnectionTypes.Main],
    credentials: [{ name: 'flovooApi', required: true }],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
    properties: [
      {
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        required: true,
        options: [
          { name: 'Message Created', value: 'message.created' },
          { name: 'Message Updated', value: 'message.updated' },
          { name: 'Contact Created', value: 'contact.created' },
          { name: 'Contact Updated', value: 'contact.updated' },
          { name: 'Contact Deleted', value: 'contact.deleted' },
          { name: 'Template Status Updated', value: 'template.status.updated' },
          { name: 'Template Quality Updated', value: 'template.quality.updated' },
          { name: 'Template Category Updated', value: 'template.category.updated' },
        ],
        default: [],
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        const webhookData = this.getWorkflowStaticData('node');
        return webhookData.webhookSubscriptionId !== undefined;
      },

      async create(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default') as string;
        const events = this.getNodeParameter('events') as string[];

        if (events.length === 0) {
          throw new NodeOperationError(this.getNode(), 'Select at least one event to subscribe to');
        }

        const credentials = await this.getCredentials('flovooApi');
        const baseUrl = (credentials.baseUrl as string).replace(/\/+$/, '');

        const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'flovooApi', {
          method: 'POST',
          url: `${baseUrl}/v1/webhooks`,
          body: { url: webhookUrl, events },
          json: true,
        })) as IDataObject;

        const webhookData = this.getWorkflowStaticData('node');
        webhookData.webhookSubscriptionId = response.id;
        webhookData.webhookSecret = response.secret;

        return true;
      },

      async delete(this: IHookFunctions): Promise<boolean> {
        const webhookData = this.getWorkflowStaticData('node');
        const subscriptionId = webhookData.webhookSubscriptionId as string | undefined;
        if (!subscriptionId) return true;

        const credentials = await this.getCredentials('flovooApi');
        const baseUrl = (credentials.baseUrl as string).replace(/\/+$/, '');

        try {
          await this.helpers.httpRequestWithAuthentication.call(this, 'flovooApi', {
            method: 'DELETE',
            url: `${baseUrl}/v1/webhooks/${subscriptionId}`,
            json: true,
          });
        } catch {
          // Already gone server-side — nothing more to clean up locally.
        }

        delete webhookData.webhookSubscriptionId;
        delete webhookData.webhookSecret;

        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const webhookData = this.getWorkflowStaticData('node');
    const secret = webhookData.webhookSecret as string | undefined;

    const req = this.getRequestObject();
    const signatureHeader = req.headers['x-flovo-signature'] as string | undefined;
    // Falling back to `JSON.stringify(getBodyData())` here would re-serialize
    // an already-parsed body, which is not guaranteed to reproduce the exact
    // bytes Flovoo signed (key order, spacing) — that reintroduces the same
    // false-negative risk `rawBody` exists to avoid. Reject instead of
    // guessing.
    const rawBody = (req as unknown as { rawBody?: Buffer }).rawBody?.toString('utf8');

    if (!secret || !rawBody || !verifySignature(signatureHeader, rawBody, secret)) {
      const response = this.getResponseObject();
      response.status(401).json({ error: 'Invalid signature' });
      return { noWebhookResponse: true };
    }

    return {
      workflowData: [this.helpers.returnJsonArray([this.getBodyData()])],
    };
  }
}
