import type { INodeProperties } from 'n8n-workflow';

export const messageOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['message'] } },
    options: [
      {
        name: 'Get Many',
        value: 'getAll',
        action: 'Get many messages',
        description: 'Return a page of messages in a conversation',
      },
      {
        name: 'Send',
        value: 'send',
        action: 'Send a message',
        description: 'Send a free-text message in an open conversation window',
      },
      {
        name: 'Send Reaction',
        value: 'sendReaction',
        action: 'Send a reaction',
        description: 'React to a specific message with an emoji, or remove an existing reaction',
      },
    ],
    default: 'send',
  },
];

export const messageFields: INodeProperties[] = [
  // getAll
  {
    displayName: 'Conversation ID',
    name: 'conversationId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: { show: { resource: ['message'], operation: ['getAll'] } },
  },
  {
    displayName: 'Page Size',
    name: 'limit',
    type: 'number',
    default: 20,
    typeOptions: { minValue: 1, maxValue: 100 },
    displayOptions: { show: { resource: ['message'], operation: ['getAll'] } },
  },
  {
    displayName: 'Page Number',
    name: 'page',
    type: 'number',
    default: 1,
    typeOptions: { minValue: 1 },
    displayOptions: { show: { resource: ['message'], operation: ['getAll'] } },
  },

  // send
  {
    displayName: 'Conversation ID',
    name: 'conversationId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: { show: { resource: ['message'], operation: ['send'] } },
  },
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: { show: { resource: ['message'], operation: ['send'] } },
  },
  {
    displayName: 'Text',
    name: 'text',
    type: 'string',
    default: '',
    description: 'Required if no attachment is given',
    displayOptions: { show: { resource: ['message'], operation: ['send'] } },
  },
  {
    displayName: 'Attachment',
    name: 'attachment',
    type: 'collection',
    placeholder: 'Add Attachment',
    default: {},
    displayOptions: { show: { resource: ['message'], operation: ['send'] } },
    options: [
      {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        default: '',
        description: 'Must be a publicly reachable URL',
      },
      {
        displayName: 'Type',
        name: 'type',
        type: 'string',
        default: '',
        description: 'e.g. image, video, audio, document',
      },
      { displayName: 'Name', name: 'name', type: 'string', default: '' },
    ],
  },
  {
    displayName: 'Reply To Message ID',
    name: 'replyToMessageId',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['message'], operation: ['send'] } },
  },

  // sendReaction
  {
    displayName: 'Conversation ID',
    name: 'conversationId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: { show: { resource: ['message'], operation: ['sendReaction'] } },
  },
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: { show: { resource: ['message'], operation: ['sendReaction'] } },
  },
  {
    displayName: 'Message Platform ID',
    name: 'messagePlatformId',
    type: 'string',
    default: '',
    required: true,
    description: 'The WhatsApp message id (e.g. wamid.xxx), not the Flovoo message UUID',
    displayOptions: { show: { resource: ['message'], operation: ['sendReaction'] } },
  },
  {
    displayName: 'Emoji',
    name: 'emoji',
    type: 'string',
    default: '',
    description: 'Leave empty to remove an existing reaction',
    displayOptions: { show: { resource: ['message'], operation: ['sendReaction'] } },
  },
];
