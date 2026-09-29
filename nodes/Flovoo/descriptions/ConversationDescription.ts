import type { INodeProperties } from 'n8n-workflow';

export const conversationOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['conversation'] } },
    options: [
      {
        name: 'Create',
        value: 'create',
        action: 'Create a conversation',
        description: 'Open a conversation between a contact and a channel, or return the existing one',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        action: 'Get many conversations',
        description: 'Return a page of conversations matching the given filters',
      },
      {
        name: 'Count',
        value: 'count',
        action: 'Count conversations',
        description: 'Count conversations matching the given filters, without fetching them',
      },
      {
        name: 'List Media',
        value: 'listMedia',
        action: 'List conversation media',
        description: 'Return the media attachments (images, video, documents) sent in a conversation',
      },
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
    displayName: 'Channel Name or ID',
    name: 'channelId',
    type: 'options',
    typeOptions: { loadOptionsMethod: 'getChannels' },
    default: '',
    required: true,
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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
    description: 'Max number of results to return',
    default: 50,
    typeOptions: { minValue: 1 },
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
      { displayName: 'Contact ID', name: 'contactId', type: 'string', default: '' },
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
      { displayName: 'Search', name: 'search', type: 'string', default: '' },
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
    ],
  },
];
