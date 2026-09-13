import type { INodeProperties } from 'n8n-workflow';

export const contactOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['contact'] } },
    options: [
      { name: 'Create', value: 'create', action: 'Create a contact' },
      { name: 'Get', value: 'get', action: 'Get a contact' },
      { name: 'Get Many', value: 'getAll', action: 'Get many contacts' },
      { name: 'Update', value: 'update', action: 'Update a contact' },
      { name: 'Delete', value: 'delete', action: 'Delete a contact' },
      { name: 'Add Tag', value: 'addTag', action: 'Add a tag to a contact' },
      { name: 'Remove Tag', value: 'removeTag', action: 'Remove a tag from a contact' },
      { name: 'Set Stage', value: 'setStage', action: 'Set a contact stage' },
      { name: 'Block', value: 'block', action: 'Block a contact' },
      { name: 'Unblock', value: 'unblock', action: 'Unblock a contact' },
    ],
    default: 'create',
  },
];

const contactId: INodeProperties = {
  displayName: 'Contact ID',
  name: 'contactId',
  type: 'string',
  default: '',
  required: true,
  description: 'The contact ID (UUID)',
};

export const contactFields: INodeProperties[] = [
  // create
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    default: '',
    required: true,
    displayOptions: { show: { resource: ['contact'], operation: ['create'] } },
  },
  {
    displayName: 'Phone',
    name: 'phone',
    type: 'string',
    default: '',
    required: true,
    description: 'Digits only, with country code, no + or spaces (e.g. 201234567890)',
    displayOptions: { show: { resource: ['contact'], operation: ['create'] } },
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['contact'], operation: ['create'] } },
    options: [
      { displayName: 'Email', name: 'email', type: 'string', default: '' },
      { displayName: 'Avatar URL', name: 'avatar', type: 'string', default: '' },
      { displayName: 'Assignee ID', name: 'assigneeId', type: 'string', default: '' },
      { displayName: 'Stage ID', name: 'stageId', type: 'string', default: '' },
      {
        displayName: 'Tag IDs',
        name: 'tagIds',
        type: 'string',
        default: '',
        description: 'Comma-separated list of tag UUIDs',
      },
    ],
  },

  // get / update / delete / addTag / removeTag / setStage / block / unblock — all need contactId
  {
    ...contactId,
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['get', 'update', 'delete', 'addTag', 'removeTag', 'setStage', 'block', 'unblock'],
      },
    },
  },

  // getAll
  {
    displayName: 'Page Size',
    name: 'limit',
    type: 'number',
    default: 20,
    typeOptions: { minValue: 1, maxValue: 100 },
    displayOptions: { show: { resource: ['contact'], operation: ['getAll'] } },
  },
  {
    displayName: 'Page Number',
    name: 'page',
    type: 'number',
    default: 1,
    typeOptions: { minValue: 1 },
    displayOptions: { show: { resource: ['contact'], operation: ['getAll'] } },
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: { show: { resource: ['contact'], operation: ['getAll'] } },
    options: [
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
      { displayName: 'Is Blocked', name: 'isBlocked', type: 'boolean', default: false },
      {
        displayName: 'Tag IDs',
        name: 'tagIds',
        type: 'string',
        default: '',
        description: 'Comma-separated list of tag UUIDs',
      },
      {
        displayName: 'Stage IDs',
        name: 'stageIds',
        type: 'string',
        default: '',
        description: 'Comma-separated list of stage UUIDs',
      },
      {
        displayName: 'Assignee IDs',
        name: 'assigneeIds',
        type: 'string',
        default: '',
        description: 'Comma-separated list of user UUIDs',
      },
    ],
  },

  // update
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['contact'], operation: ['update'] } },
    options: [
      { displayName: 'Name', name: 'name', type: 'string', default: '' },
      { displayName: 'Phone', name: 'phone', type: 'string', default: '' },
      { displayName: 'Email', name: 'email', type: 'string', default: '' },
      { displayName: 'Avatar URL', name: 'avatar', type: 'string', default: '' },
      { displayName: 'Assignee ID', name: 'assigneeId', type: 'string', default: '' },
      { displayName: 'Stage ID', name: 'stageId', type: 'string', default: '' },
      { displayName: 'Notes', name: 'notes', type: 'string', default: '' },
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
        displayName: 'Tag IDs',
        name: 'tagIds',
        type: 'string',
        default: '',
        description: 'Comma-separated list of tag UUIDs — replaces the whole set',
      },
    ],
  },

  // addTag / removeTag
  {
    displayName: 'Tag ID',
    name: 'tagId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: { show: { resource: ['contact'], operation: ['addTag', 'removeTag'] } },
  },

  // setStage
  {
    displayName: 'Stage ID',
    name: 'stageId',
    type: 'string',
    default: '',
    description: 'Leave empty to clear the stage',
    displayOptions: { show: { resource: ['contact'], operation: ['setStage'] } },
  },
];
