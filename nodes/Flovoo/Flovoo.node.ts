import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IDataObject,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import { flovooApiRequest, cleanObject } from './GenericFunctions';
import { channelFields, channelOperations } from './descriptions/ChannelDescription';
import { contactFields, contactOperations } from './descriptions/ContactDescription';
import { contactStageFields, contactStageOperations } from './descriptions/ContactStageDescription';
import { conversationFields, conversationOperations } from './descriptions/ConversationDescription';
import { messageFields, messageOperations } from './descriptions/MessageDescription';
import { segmentFields, segmentOperations } from './descriptions/SegmentDescription';
import { tagFields, tagOperations } from './descriptions/TagDescription';
import { templateFields, templateOperations } from './descriptions/TemplateDescription';
import { userFields, userOperations } from './descriptions/UserDescription';

function splitIds(value: string | undefined): string[] | undefined {
  if (!value) return undefined;
  const ids = value
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  return ids.length ? ids : undefined;
}

export class Flovoo implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Flovoo',
    name: 'flovoo',
    icon: 'file:icons/flovoo.png',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description:
      'Manage contacts and conversations on Flovoo — send messages, sync contacts, and more.',
    defaults: { name: 'Flovoo' },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    credentials: [{ name: 'flovooApi', required: true }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Contact', value: 'contact' },
          { name: 'Conversation', value: 'conversation' },
          { name: 'Message', value: 'message' },
          { name: 'Template', value: 'template' },
          { name: 'Tag', value: 'tag' },
          { name: 'Contact Stage', value: 'contactStage' },
          { name: 'Segment', value: 'segment' },
          { name: 'User', value: 'user' },
          { name: 'Channel', value: 'channel' },
        ],
        default: 'contact',
      },
      ...contactOperations,
      ...contactFields,
      ...conversationOperations,
      ...conversationFields,
      ...messageOperations,
      ...messageFields,
      ...templateOperations,
      ...templateFields,
      ...tagOperations,
      ...tagFields,
      ...contactStageOperations,
      ...contactStageFields,
      ...segmentOperations,
      ...segmentFields,
      ...userOperations,
      ...userFields,
      ...channelOperations,
      ...channelFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: IDataObject[] = [];

    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      let responseData: IDataObject | IDataObject[] = {};

      if (resource === 'contact') {
        if (operation === 'create') {
          const name = this.getNodeParameter('name', i) as string;
          const phone = this.getNodeParameter('phone', i) as string;
          const additional = this.getNodeParameter('additionalFields', i) as IDataObject;
          const body = cleanObject({
            name,
            phone,
            email: additional.email,
            avatar: additional.avatar,
            assigneeId: additional.assigneeId,
            stageId: additional.stageId,
            tagIds: splitIds(additional.tagIds as string),
          });
          responseData = await flovooApiRequest.call(this, 'POST', '/v1/contacts', body);
        } else if (operation === 'get') {
          const contactId = this.getNodeParameter('contactId', i) as string;
          responseData = await flovooApiRequest.call(this, 'GET', `/v1/contacts/${contactId}`);
        } else if (operation === 'getAll') {
          const limit = this.getNodeParameter('limit', i) as number;
          const page = this.getNodeParameter('page', i) as number;
          const filters = this.getNodeParameter('filters', i) as IDataObject;
          const qs = cleanObject({
            search: filters.search,
            status: filters.status,
            isBlocked: filters.isBlocked,
            tagIds: splitIds(filters.tagIds as string),
            stageIds: splitIds(filters.stageIds as string),
            assigneeIds: splitIds(filters.assigneeIds as string),
          });
          const response = await flovooApiRequest.call(this, 'GET', '/v1/contacts', {}, { ...qs, limit, page });
          responseData = response.data as IDataObject[];
        } else if (operation === 'update') {
          const contactId = this.getNodeParameter('contactId', i) as string;
          const update = this.getNodeParameter('updateFields', i) as IDataObject;
          const body = cleanObject({
            name: update.name,
            phone: update.phone,
            email: update.email,
            avatar: update.avatar,
            assigneeId: update.assigneeId,
            stageId: update.stageId,
            notes: update.notes,
            status: update.status,
            tagIds: splitIds(update.tagIds as string),
          });
          responseData = await flovooApiRequest.call(this, 'PATCH', `/v1/contacts/${contactId}`, body);
        } else if (operation === 'delete') {
          const contactId = this.getNodeParameter('contactId', i) as string;
          await flovooApiRequest.call(this, 'DELETE', `/v1/contacts/${contactId}`);
          responseData = { success: true };
        } else if (operation === 'addTag') {
          const contactId = this.getNodeParameter('contactId', i) as string;
          const tagId = this.getNodeParameter('tagId', i) as string;
          responseData = await flovooApiRequest.call(this, 'POST', `/v1/contacts/${contactId}/tags/${tagId}`);
        } else if (operation === 'removeTag') {
          const contactId = this.getNodeParameter('contactId', i) as string;
          const tagId = this.getNodeParameter('tagId', i) as string;
          responseData = await flovooApiRequest.call(this, 'DELETE', `/v1/contacts/${contactId}/tags/${tagId}`);
        } else if (operation === 'setStage') {
          const contactId = this.getNodeParameter('contactId', i) as string;
          const stageId = (this.getNodeParameter('stageId', i) as string) || null;
          responseData = await flovooApiRequest.call(this, 'PUT', `/v1/contacts/${contactId}/stage`, { stageId });
        } else if (operation === 'block') {
          const contactId = this.getNodeParameter('contactId', i) as string;
          responseData = await flovooApiRequest.call(this, 'POST', `/v1/contacts/${contactId}/block`);
        } else if (operation === 'unblock') {
          const contactId = this.getNodeParameter('contactId', i) as string;
          responseData = await flovooApiRequest.call(this, 'POST', `/v1/contacts/${contactId}/unblock`);
        }
      } else if (resource === 'conversation') {
        if (operation === 'create') {
          const contactId = this.getNodeParameter('contactId', i) as string;
          const channelId = this.getNodeParameter('channelId', i) as string;
          responseData = await flovooApiRequest.call(this, 'POST', '/v1/conversations', {
            contactId,
            channelId,
          });
        } else if (operation === 'getAll') {
          const limit = this.getNodeParameter('limit', i) as number;
          const page = this.getNodeParameter('page', i) as number;
          const filters = this.getNodeParameter('filters', i) as IDataObject;
          const qs = cleanObject({ ...filters });
          const response = await flovooApiRequest.call(this, 'GET', '/v1/conversations', {}, { ...qs, limit, page });
          responseData = response.data as IDataObject[];
        } else if (operation === 'count') {
          const filters = this.getNodeParameter('filters', i) as IDataObject;
          const qs = cleanObject({ ...filters });
          responseData = await flovooApiRequest.call(this, 'GET', '/v1/conversations/count', {}, qs);
        } else if (operation === 'listMedia') {
          const conversationId = this.getNodeParameter('conversationId', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const page = this.getNodeParameter('page', i) as number;
          const response = await flovooApiRequest.call(
            this, 'GET', `/v1/conversations/${conversationId}/media`, {}, { limit, page },
          );
          responseData = response.data as IDataObject[];
        }
      } else if (resource === 'message') {
        if (operation === 'getAll') {
          const conversationId = this.getNodeParameter('conversationId', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const page = this.getNodeParameter('page', i) as number;
          const response = await flovooApiRequest.call(
            this, 'GET', '/v1/messages', {}, { conversationId, limit, page },
          );
          responseData = response.data as IDataObject[];
        } else if (operation === 'send') {
          const conversationId = this.getNodeParameter('conversationId', i) as string;
          const contactId = this.getNodeParameter('contactId', i) as string;
          const text = this.getNodeParameter('text', i) as string;
          const attachment = this.getNodeParameter('attachment', i) as IDataObject;
          const replyToMessageId = this.getNodeParameter('replyToMessageId', i) as string;
          const body = cleanObject({
            conversationId,
            contactId,
            text,
            attachment: Object.keys(cleanObject(attachment)).length ? cleanObject(attachment) : undefined,
            replyToMessageId,
          });
          responseData = await flovooApiRequest.call(this, 'POST', '/v1/messages', body);
        } else if (operation === 'sendReaction') {
          const conversationId = this.getNodeParameter('conversationId', i) as string;
          const contactId = this.getNodeParameter('contactId', i) as string;
          const messagePlatformId = this.getNodeParameter('messagePlatformId', i) as string;
          const emoji = this.getNodeParameter('emoji', i) as string;
          responseData = await flovooApiRequest.call(this, 'POST', '/v1/messages/reactions', {
            conversationId,
            contactId,
            messagePlatformId,
            emoji,
          });
        }
      } else if (resource === 'tag') {
        if (operation === 'getAll') {
          const limit = this.getNodeParameter('limit', i) as number;
          const page = this.getNodeParameter('page', i) as number;
          const response = await flovooApiRequest.call(this, 'GET', '/v1/tags', {}, { limit, page });
          responseData = response.data as IDataObject[];
        } else if (operation === 'update') {
          const tagId = this.getNodeParameter('tagId', i) as string;
          const update = this.getNodeParameter('updateFields', i) as IDataObject;
          responseData = await flovooApiRequest.call(this, 'PATCH', `/v1/tags/${tagId}`, cleanObject(update));
        } else if (operation === 'delete') {
          const tagId = this.getNodeParameter('tagId', i) as string;
          await flovooApiRequest.call(this, 'DELETE', `/v1/tags/${tagId}`);
          responseData = { success: true };
        }
      } else if (resource === 'contactStage') {
        if (operation === 'getAll') {
          const response = await flovooApiRequest.call(this, 'GET', '/v1/contact-stages');
          responseData = response.data as IDataObject[];
        } else if (operation === 'update') {
          const stageId = this.getNodeParameter('stageId', i) as string;
          const update = this.getNodeParameter('updateFields', i) as IDataObject;
          responseData = await flovooApiRequest.call(this, 'PATCH', `/v1/contact-stages/${stageId}`, cleanObject(update));
        } else if (operation === 'delete') {
          const stageId = this.getNodeParameter('stageId', i) as string;
          const transferToStageId = this.getNodeParameter('transferToStageId', i) as string;
          await flovooApiRequest.call(this, 'DELETE', `/v1/contact-stages/${stageId}`, { transferToStageId });
          responseData = { success: true };
        }
      } else if (resource === 'segment') {
        const response = await flovooApiRequest.call(this, 'GET', '/v1/segments');
        responseData = response.data as IDataObject[];
      } else if (resource === 'template') {
        if (operation === 'getAll') {
          const limit = this.getNodeParameter('limit', i) as number;
          const page = this.getNodeParameter('page', i) as number;
          const filters = this.getNodeParameter('filters', i) as IDataObject;
          const qs = cleanObject({ ...filters });
          const response = await flovooApiRequest.call(this, 'GET', '/v1/whatsapp-templates', {}, { ...qs, limit, page });
          responseData = response.data as IDataObject[];
        } else if (operation === 'send') {
          const conversationId = this.getNodeParameter('conversationId', i) as string;
          const contactId = this.getNodeParameter('contactId', i) as string;
          const templateId = this.getNodeParameter('templateId', i) as string;
          const additional = this.getNodeParameter('additionalFields', i) as IDataObject;
          const body = cleanObject({
            conversationId,
            contactId,
            templateId,
            bodyParameters: splitIds(additional.bodyParameters as string),
            headerTextParameter: additional.headerTextParameter,
            headerMediaKey: additional.headerMediaKey,
            urlButtonParameters: splitIds(additional.urlButtonParameters as string),
          });
          responseData = await flovooApiRequest.call(this, 'POST', '/v1/whatsapp-templates/send', body);
        }
      } else if (resource === 'user') {
        const limit = this.getNodeParameter('limit', i) as number;
        const page = this.getNodeParameter('page', i) as number;
        const search = this.getNodeParameter('search', i) as string;
        const qs = cleanObject({ search });
        const response = await flovooApiRequest.call(this, 'GET', '/v1/users', {}, { ...qs, limit, page });
        responseData = response.data as IDataObject[];
      } else if (resource === 'channel') {
        const platformType = this.getNodeParameter('platformType', i) as string;
        const response = await flovooApiRequest.call(this, 'GET', '/v1/channels', {}, cleanObject({ platformType }));
        responseData = response.data as IDataObject[];
      }

      if (Array.isArray(responseData)) {
        returnData.push(...responseData);
      } else {
        returnData.push(responseData);
      }
    }

    return [this.helpers.returnJsonArray(returnData)];
  }
}
