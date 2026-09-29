import type { INodeProperties } from 'n8n-workflow';

export const contactOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['contact'] } },
    options: [
      {
        name: 'Add Tag',
        value: 'addTag',
        action: 'Add a tag to a contact',
        description: 'Attach an existing tag to a contact',
      },
      {
        name: 'Block',
        value: 'block',
        action: 'Block a contact',
        description: 'Block a contact from sending messages',
      },
      {
        name: 'Create',
        value: 'create',
        action: 'Create a contact',
        description: 'Create a new contact with a name and phone number, plus optional email, stage, and tags',
      },
      {
        name: 'Delete',
        value: 'delete',
        action: 'Delete a contact',
        description: 'Permanently delete a contact',
      },
      {
        name: 'Get',
        value: 'get',
        action: 'Get a contact',
        description: 'Retrieve a single contact by its ID, or by searching name, email, or phone',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        action: 'Get many contacts',
        description: 'Return a page of contacts matching the given filters',
      },
      {
        name: 'Remove Tag',
        value: 'removeTag',
        action: 'Remove a tag from a contact',
        description: 'Detach a tag from a contact',
      },
      {
        name: 'Set Stage',
        value: 'setStage',
        action: 'Set a contact stage',
        description: 'Move a contact to a given stage',
      },
      {
        name: 'Unblock',
        value: 'unblock',
        action: 'Unblock a contact',
        description: 'Unblock a contact and allow them to send messages again',
      },
      {
        name: 'Update',
        value: 'update',
        action: 'Update a contact',
        description: "Update a contact's fields. Leave a field empty to keep its current value",
      },
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
    displayName: 'Email',
    name: 'email',
    type: 'string',
    placeholder: 'name@email.com',
    default: '',
    displayOptions: { show: { resource: ['contact'], operation: ['create'] } },
  },
  {
    displayName: 'Stage Name or ID',
    name: 'stageId',
    type: 'options',
    typeOptions: { loadOptionsMethod: 'getStages' },
    default: '',
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    displayOptions: { show: { resource: ['contact'], operation: ['create'] } },
  },
  {
    displayName: 'Tags Names or IDs',
    name: 'tagIds',
    type: 'multiOptions',
    typeOptions: { loadOptionsMethod: 'getTags' },
    default: [],
    description: 'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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
      { displayName: 'Avatar URL', name: 'avatar', type: 'string', default: '' },
      {
        displayName: 'Assignee Name or ID',
        name: 'assigneeId',
        type: 'options',
        typeOptions: { loadOptionsMethod: 'getUsers' },
        default: '',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
      },
    ],
  },

  // get
  {
    displayName: 'Identifier Type',
    name: 'identifierType',
    type: 'options',
    noDataExpression: true,
    options: [
      { name: 'ID', value: 'id' },
      { name: 'Search (Name, Email, or Phone)', value: 'search' },
    ],
    default: 'id',
    displayOptions: { show: { resource: ['contact'], operation: ['get'] } },
  },
  {
    ...contactId,
    displayOptions: {
      show: { resource: ['contact'], operation: ['get'], identifierType: ['id'] },
    },
  },
  {
    displayName: 'Search Value',
    name: 'searchValue',
    type: 'string',
    default: '',
    required: true,
    description: 'Matched against name, email, username, and phone. Returns the first match',
    displayOptions: { show: { resource: ['contact'], operation: ['get'], identifierType: ['search'] } },
  },

  // update / delete / addTag / removeTag / setStage / block / unblock — all need contactId
  {
    ...contactId,
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['update', 'delete', 'addTag', 'removeTag', 'setStage', 'block', 'unblock'],
      },
    },
  },

  // getAll
  {
    displayName: 'Page Size',
    name: 'limit',
    type: 'number',
    description: 'Max number of results to return',
    default: 50,
    typeOptions: { minValue: 1 },
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
      {
        displayName: 'Assignees Names or IDs',
        name: 'assigneeIds',
        type: 'multiOptions',
        typeOptions: { loadOptionsMethod: 'getUsers' },
        default: [],
        description: 'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
      },
      { displayName: 'Is Blocked', name: 'isBlocked', type: 'boolean', default: false },
      { displayName: 'Search', name: 'search', type: 'string', default: '' },
      {
        displayName: 'Stages Names or IDs',
        name: 'stageIds',
        type: 'multiOptions',
        typeOptions: { loadOptionsMethod: 'getStages' },
        default: [],
        description: 'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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
        displayName: 'Tags Names or IDs',
        name: 'tagIds',
        type: 'multiOptions',
        typeOptions: { loadOptionsMethod: 'getTags' },
        default: [],
        description: 'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
      },
    ],
  },

  // update
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['contact'], operation: ['update'] } },
  },
  {
    displayName: 'Phone',
    name: 'phone',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['contact'], operation: ['update'] } },
  },
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    placeholder: 'name@email.com',
    default: '',
    displayOptions: { show: { resource: ['contact'], operation: ['update'] } },
  },
  {
    displayName: 'Stage Name or ID',
    name: 'stageId',
    type: 'options',
    typeOptions: { loadOptionsMethod: 'getStages' },
    default: '',
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    displayOptions: { show: { resource: ['contact'], operation: ['update'] } },
  },
  {
    displayName: 'Tags Names or IDs',
    name: 'tagIds',
    type: 'multiOptions',
    typeOptions: { loadOptionsMethod: 'getTags' },
    default: [],
    description: 'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>. Replaces the whole set of tags.',
    displayOptions: { show: { resource: ['contact'], operation: ['update'] } },
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['contact'], operation: ['update'] } },
    options: [
      { displayName: 'Avatar URL', name: 'avatar', type: 'string', default: '' },
      {
        displayName: 'Assignee Name or ID',
        name: 'assigneeId',
        type: 'options',
        typeOptions: { loadOptionsMethod: 'getUsers' },
        default: '',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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
    ],
  },
  {
    displayName: 'Custom Fields',
    name: 'customFields',
    type: 'fixedCollection',
    placeholder: 'Add Custom Field',
    default: {},
    typeOptions: { multipleValues: true },
    displayOptions: { show: { resource: ['contact'], operation: ['update'] } },
    options: [
      {
        displayName: 'Field',
        name: 'field',
        values: [
          {
            displayName: 'Field Key',
            name: 'key',
            type: 'options',
            typeOptions: { loadOptionsMethod: 'getCustomFieldKeys' },
            default: '',
            required: true,
          },
          {
            displayName: 'Value',
            name: 'value',
            type: 'string',
            default: '',
            required: true,
            description: 'Free text for Text/URL fields. For Single/Multi Select fields, use the option ID(s) from Custom Field > Get Many, not the label',
          },
        ],
      },
    ],
  },

  // addTag / removeTag
  {
    displayName: 'Tag Name or ID',
    name: 'tagId',
    type: 'options',
    typeOptions: { loadOptionsMethod: 'getTags' },
    default: '',
    required: true,
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    displayOptions: { show: { resource: ['contact'], operation: ['addTag', 'removeTag'] } },
  },

  // setStage
  {
    displayName: 'Stage Name or ID',
    name: 'stageId',
    type: 'options',
    typeOptions: { loadOptionsMethod: 'getStages' },
    default: '',
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>. Leave empty to clear the stage.',
    displayOptions: { show: { resource: ['contact'], operation: ['setStage'] } },
  },
];
