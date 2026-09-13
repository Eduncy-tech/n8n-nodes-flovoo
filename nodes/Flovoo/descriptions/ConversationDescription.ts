import type { INodeProperties } from 'n8n-workflow';

export const conversationOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['conversation'] } },
    options: [
      { name: 'Create', value: 'create', action: 'Create a conversation' },
      { name: 'Get Many', value: 'getAll', action: 'Get many conversations' },
      { name: 'Count', value: 'count', action: 'Count conversations' },
      { name: 'List Media', value: 'listMedia', action: 'List conversation media' },
    ],
    default: 'create',
  },
];

export const conversationFields: INodeProperties[] = [
  // create
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: { show: { resource: ['conversation'], operation: ['create'] } },
  },
  {
    displayName: 'Channel ID',
    name: 'channelId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: { show: { resource: ['conversation'], operation: ['create'] } },
  },

  // listMedia
  {
    displayName: 'Conversation ID',
    name: 'conversationId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: { show: { resource: ['conversation'], operation: ['listMedia'] } },
  },

  // getAll / count
  {
    displayName: 'Page Size',
    name: 'limit',
    type: 'number',
    default: 20,
    typeOptions: { minValue: 1, maxValue: 100 },
    displayOptions: { show: { resource: ['conversation'], operation: ['getAll', 'listMedia'] } },
  },
  {
    displayName: 'Page Number',
    name: 'page',
    type: 'number',
    default: 1,
    typeOptions: { minValue: 1 },
    displayOptions: { show: { resource: ['conversation'], operation: ['getAll', 'listMedia'] } },
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: { show: { resource: ['conversation'], operation: ['getAll', 'count'] } },
    options: [
      { displayName: 'Search', name: 'search', type: 'string', default: '' },
      { displayName: 'Contact ID', name: 'contactId', type: 'string', default: '' },
      {
        displayName: 'Category',
        name: 'category',
        type: 'options',
        options: [
          { name: 'All', value: 'all' },
          { name: 'My', value: 'my' },
          { name: 'Unassigned', value: 'unassigned' },
        ],
        default: 'all',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          { name: 'Active', value: 'active' },
          { name: 'Archived', value: 'archived' },
        ],
        default: 'active',
      },
      {
        displayName: 'Quick Filter',
        name: 'quickFilter',
        type: 'options',
        options: [
          { name: 'Unread', value: 'Unread' },
          { name: 'Not Replied', value: 'NotReplied' },
        ],
        default: 'Unread',
      },
    ],
  },
];
