import type { INodeProperties } from 'n8n-workflow';

export const templateOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['template'] } },
    options: [
      {
        name: 'Get Many',
        value: 'getAll',
        action: 'Get many templates',
        description: 'Return a page of WhatsApp message templates, approved by default — filter by status to see others',
      },
      {
        name: 'Send',
        value: 'send',
        action: 'Send a template',
        description: 'Send an approved WhatsApp template — the only way to message a contact outside the 24-hour window',
      },
    ],
    default: 'send',
  },
];

export const templateFields: INodeProperties[] = [
  // getAll
  {
    displayName: 'Page Size',
    name: 'limit',
    type: 'number',
    description: 'Max number of results to return',
    default: 50,
    typeOptions: { minValue: 1 },
    displayOptions: { show: { resource: ['template'], operation: ['getAll'] } },
  },
  {
    displayName: 'Page Number',
    name: 'page',
    type: 'number',
    default: 1,
    typeOptions: { minValue: 1 },
    displayOptions: { show: { resource: ['template'], operation: ['getAll'] } },
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: { show: { resource: ['template'], operation: ['getAll'] } },
    options: [
      { displayName: 'Search', name: 'search', type: 'string', default: '' },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          { name: 'Approved', value: 'APPROVED' },
          { name: 'Disabled', value: 'DISABLED' },
          { name: 'Paused', value: 'PAUSED' },
          { name: 'Pending', value: 'PENDING' },
          { name: 'Rejected', value: 'REJECTED' },
        ],
        default: 'APPROVED',
      },
    ],
  },

  // send
  {
    displayName: 'Conversation ID',
    name: 'conversationId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: { show: { resource: ['template'], operation: ['send'] } },
  },
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: { show: { resource: ['template'], operation: ['send'] } },
  },
  {
    displayName: 'Template Name or ID',
    name: 'templateId',
    type: 'options',
    typeOptions: { loadOptionsMethod: 'getTemplates' },
    default: '',
    required: true,
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    displayOptions: { show: { resource: ['template'], operation: ['send'] } },
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['template'], operation: ['send'] } },
    options: [
      {
        displayName: 'Body Parameters',
        name: 'bodyParameters',
        type: 'string',
        default: '',
        description: 'Comma-separated values, in the order the template variables appear',
      },
      { displayName: 'Header Text Parameter', name: 'headerTextParameter', type: 'string', default: '' },
      { displayName: 'Header Media Key', name: 'headerMediaKey', type: 'string', default: '' },
      {
        displayName: 'URL Button Parameters',
        name: 'urlButtonParameters',
        type: 'string',
        default: '',
        description: 'Comma-separated values for dynamic URL button variables',
      },
    ],
  },
];
