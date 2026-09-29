import type {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  INodePropertyOptions,
  IDataObject,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import { flovooApiRequest, cleanObject } from './GenericFunctions';
import { channelFields, channelOperations } from './descriptions/ChannelDescription';
import { contactFields, contactOperations } from './descriptions/ContactDescription';
import { stageFields as contactStageFields, stageOperations as contactStageOperations } from './descriptions/ContactStageDescription';
import { conversationFields, conversationOperations } from './descriptions/ConversationDescription';
import { customFieldFields, customFieldOperations } from './descriptions/CustomFieldDescription';
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
    icon: { light: 'file:icons/flovoo.light.svg', dark: 'file:icons/flovoo.dark.svg' },
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    usableAsTool: true,
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
          { name: 'Channel', value: 'channel' },
          { name: 'Contact', value: 'contact' },
          { name: 'Conversation', value: 'conversation' },
          { name: 'Custom Field', value: 'customField' },
          { name: 'Message', value: 'message' },
          { name: 'Segment', value: 'segment' },
          { name: 'Stage', value: 'contactStage' },
          { name: 'Tag', value: 'tag' },
          { name: 'Template', value: 'template' },
          { name: 'User', value: 'user' },
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
      ...customFieldOperations,
      ...customFieldFields,
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
          const email = this.getNodeParameter('email', i) as string;
          const stageId = this.getNodeParameter('stageId', i) as string;
          const tagIds = this.getNodeParameter('tagIds', i) as string[];
          const additional = this.getNodeParameter('additionalFields', i) as IDataObject;
          const body = cleanObject({
            name,
            phone,
            email,
            stageId,
            tagIds: tagIds.length ? tagIds : undefined,
            avatar: additional.avatar,
            assigneeId: additional.assigneeId,
          });
          responseData = await flovooApiRequest.call(this, 'POST', '/v1/contacts', body);
        } else if (operation === 'get') {
          const identifierType = this.getNodeParameter('identifierType', i) as string;
          if (identifierType === 'search') {
            const searchValue = this.getNodeParameter('searchValue', i) as string;
            const response = await flovooApiRequest.call(this, 'GET', '/v1/contacts', {}, { search: searchValue, limit: 1 });
            const [match] = response.data as IDataObject[];
            if (!match) {
              throw new NodeOperationError(this.getNode(), `No contact found matching "${searchValue}"`);
            }
            responseData = match;
          } else {
            const contactId = this.getNodeParameter('contactId', i) as string;
            responseData = await flovooApiRequest.call(this, 'GET', `/v1/contacts/${contactId}`);
          }
        } else if (operation === 'getAll') {
          const limit = this.getNodeParameter('limit', i) as number;
          const page = this.getNodeParameter('page', i) as number;
          const filters = this.getNodeParameter('filters', i) as IDataObject;
          const filterTagIds = filters.tagIds as string[] | undefined;
          const filterStageIds = filters.stageIds as string[] | undefined;
          const filterAssigneeIds = filters.assigneeIds as string[] | undefined;
          const qs = cleanObject({
            search: filters.search,
            status: filters.status,
            isBlocked: filters.isBlocked,
            tagIds: filterTagIds?.length ? filterTagIds : undefined,
            stageIds: filterStageIds?.length ? filterStageIds : undefined,
            assigneeIds: filterAssigneeIds?.length ? filterAssigneeIds : undefined,
          });
          const response = await flovooApiRequest.call(this, 'GET', '/v1/contacts', {}, { ...qs, limit, page });
          responseData = response.data as IDataObject[];
        } else if (operation === 'update') {
          const contactId = this.getNodeParameter('contactId', i) as string;
          const name = this.getNodeParameter('name', i) as string;
          const phone = this.getNodeParameter('phone', i) as string;
          const email = this.getNodeParameter('email', i) as string;
          const stageId = this.getNodeParameter('stageId', i) as string;
          const tagIds = this.getNodeParameter('tagIds', i) as string[];
          const additional = this.getNodeParameter('additionalFields', i) as IDataObject;
          const customFieldsCollection = this.getNodeParameter('customFields', i) as IDataObject;
          const customFieldRows = (customFieldsCollection.field as IDataObject[] | undefined) ?? [];
          const customFields = customFieldRows.reduce((acc, row) => {
            if (row.key) acc[row.key as string] = row.value;
            return acc;
          }, {} as IDataObject);
          const body = cleanObject({
            name,
            phone,
            email,
            avatar: additional.avatar,
            assigneeId: additional.assigneeId,
            stageId,
            status: additional.status,
            tagIds: tagIds?.length ? tagIds : undefined,
            customFields: Object.keys(customFields).length ? customFields : undefined,
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
          const name = this.getNodeParameter('name', i) as string;
          const color = this.getNodeParameter('color', i) as string;
          const tagId = this.getNodeParameter('tagId', i) as string;
          responseData = await flovooApiRequest.call(this, 'PATCH', `/v1/tags/${tagId}`, cleanObject({ name, color }));
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
          const name = this.getNodeParameter('name', i) as string;
          const stageId = this.getNodeParameter('stageId', i) as string;
          const color = this.getNodeParameter('color', i) as string;
          const description = this.getNodeParameter('description', i) as string;
          responseData = await flovooApiRequest.call(
            this, 'PATCH', `/v1/contact-stages/${stageId}`, cleanObject({ name, color, description }),
          );
        } else if (operation === 'delete') {
          const stageId = this.getNodeParameter('stageId', i) as string;
          const transferToStageId = this.getNodeParameter('transferToStageId', i) as string;
          await flovooApiRequest.call(this, 'DELETE', `/v1/contact-stages/${stageId}`, { transferToStageId });
          responseData = { success: true };
        }
      } else if (resource === 'segment') {
        const response = await flovooApiRequest.call(this, 'GET', '/v1/segments');
        responseData = response.data as IDataObject[];
      } else if (resource === 'customField') {
        if (operation === 'getAll') {
          const status = this.getNodeParameter('status', i) as string;
          const response = await flovooApiRequest.call(this, 'GET', '/v1/custom-fields', {}, { status });
          responseData = response.data as IDataObject[];
        } else if (operation === 'create') {
          const name = this.getNodeParameter('name', i) as string;
          const type = this.getNodeParameter('type', i) as string;
          const description = this.getNodeParameter('description', i) as string;
          const optionsCollection = this.getNodeParameter('options', i) as IDataObject;
          const optionRows = (optionsCollection.option as IDataObject[] | undefined) ?? [];
          const options = optionRows.map((row) => cleanObject({ label: row.label, color: row.color }));
          const body = cleanObject({
            name,
            type,
            description: description || undefined,
            options: options.length ? options : undefined,
          });
          responseData = await flovooApiRequest.call(this, 'POST', '/v1/custom-fields', body);
        } else if (operation === 'update') {
          const customFieldId = this.getNodeParameter('customFieldId', i) as string;
          const name = this.getNodeParameter('name', i) as string;
          const description = this.getNodeParameter('description', i) as string;
          const optionsCollection = this.getNodeParameter('options', i) as IDataObject;
          const optionRows = (optionsCollection.option as IDataObject[] | undefined) ?? [];
          const options = optionRows.map((row) => cleanObject({ id: row.id, label: row.label, color: row.color }));
          const body = cleanObject({
            name: name || undefined,
            description: description || undefined,
            options: options.length ? options : undefined,
          });
          responseData = await flovooApiRequest.call(this, 'PATCH', `/v1/custom-fields/${customFieldId}`, body);
        } else if (operation === 'archive') {
          const customFieldId = this.getNodeParameter('customFieldId', i) as string;
          responseData = await flovooApiRequest.call(this, 'PATCH', `/v1/custom-fields/${customFieldId}/archive`);
        } else if (operation === 'restore') {
          const customFieldId = this.getNodeParameter('customFieldId', i) as string;
          responseData = await flovooApiRequest.call(this, 'PATCH', `/v1/custom-fields/${customFieldId}/restore`);
        } else if (operation === 'delete') {
          const customFieldId = this.getNodeParameter('customFieldId', i) as string;
          await flovooApiRequest.call(this, 'DELETE', `/v1/custom-fields/${customFieldId}`);
          responseData = { success: true };
        }
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
            headerMediaKey: additional.headerMediaUrl,
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

  methods = {
    loadOptions: {
      async getTags(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const response = await flovooApiRequest.call(this as unknown as IExecuteFunctions, 'GET', '/v1/tags', {}, { limit: 100 });
        return (response.data as IDataObject[]).map((tag) => ({
          name: tag.name as string,
          value: tag.id as string,
        }));
      },
      async getStages(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const response = await flovooApiRequest.call(this as unknown as IExecuteFunctions, 'GET', '/v1/contact-stages');
        return (response.data as IDataObject[]).map((stage) => ({
          name: stage.name as string,
          value: stage.id as string,
        }));
      },
      async getStagesExcludingSelected(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const response = await flovooApiRequest.call(this as unknown as IExecuteFunctions, 'GET', '/v1/contact-stages');
        const selectedStageId = this.getCurrentNodeParameter('stageId') as string;
        return (response.data as IDataObject[])
          .filter((stage) => stage.id !== selectedStageId)
          .map((stage) => ({
            name: stage.name as string,
            value: stage.id as string,
          }));
      },
      async getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const response = await flovooApiRequest.call(this as unknown as IExecuteFunctions, 'GET', '/v1/users', {}, { limit: 100 });
        return (response.data as IDataObject[]).map((user) => ({
          name: user.name as string,
          value: user.id as string,
        }));
      },
      async getTemplates(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const response = await flovooApiRequest.call(this as unknown as IExecuteFunctions, 'GET', '/v1/whatsapp-templates', {}, { limit: 100 });
        return (response.data as IDataObject[]).map((template) => ({
          name: template.name as string,
          value: template.id as string,
        }));
      },
      async getChannels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const response = await flovooApiRequest.call(this as unknown as IExecuteFunctions, 'GET', '/v1/channels');
        return (response.data as IDataObject[]).map((channel) => ({
          name: channel.name as string,
          value: channel.id as string,
        }));
      },
      async getCustomFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const response = await flovooApiRequest.call(
          this as unknown as IExecuteFunctions, 'GET', '/v1/custom-fields', {}, { status: 'ACTIVE' },
        );
        return (response.data as IDataObject[]).map((field) => ({
          name: field.name as string,
          value: field.id as string,
        }));
      },
      async getArchivedCustomFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const response = await flovooApiRequest.call(
          this as unknown as IExecuteFunctions, 'GET', '/v1/custom-fields', {}, { status: 'ARCHIVED' },
        );
        return (response.data as IDataObject[]).map((field) => ({
          name: field.name as string,
          value: field.id as string,
        }));
      },
      async getCustomFieldKeys(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const response = await flovooApiRequest.call(
          this as unknown as IExecuteFunctions, 'GET', '/v1/custom-fields', {}, { status: 'ACTIVE' },
        );
        return (response.data as IDataObject[]).map((field) => ({
          name: field.name as string,
          value: field.fieldKey as string,
        }));
      },
    },
  };
}
