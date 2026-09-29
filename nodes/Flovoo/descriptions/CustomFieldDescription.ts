import type { INodeProperties } from 'n8n-workflow';

export const customFieldOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['customField'] } },
    options: [
      {
        name: 'Archive',
        value: 'archive',
        action: 'Archive a custom field',
        description: 'Hide a custom field without deleting its data',
      },
      {
        name: 'Create',
        value: 'create',
        action: 'Create a custom field',
        description: 'Add a new custom field for contacts',
      },
      {
        name: 'Delete',
        value: 'delete',
        action: 'Delete a custom field',
        description: 'Permanently delete a custom field. Fails if it already has data on any contact — archive it instead.',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        action: 'Get many custom fields',
        description: 'Return every custom field defined for contacts',
      },
      {
        name: 'Restore',
        value: 'restore',
        action: 'Restore a custom field',
        description: 'Unarchive a previously archived custom field',
      },
      {
        name: 'Update',
        value: 'update',
        action: 'Update a custom field',
        description: 'Rename a custom field, change its description, or edit its options',
      },
    ],
    default: 'getAll',
  },
];

const optionsField: INodeProperties = {
  displayName: 'Options',
  name: 'options',
  type: 'fixedCollection',
  placeholder: 'Add Option',
  default: {},
  typeOptions: { multipleValues: true },
  description: 'Required for Single Select and Multi Select fields',
  options: [
    {
      displayName: 'Option',
      name: 'option',
      values: [
        {
          displayName: 'Label',
          name: 'label',
          type: 'string',
          default: '',
          required: true,
        },
        {
          displayName: 'Color',
          name: 'color',
          type: 'color',
          default: '#74d44e',
        },
      ],
    },
  ],
};

export const customFieldFields: INodeProperties[] = [
  // create
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    default: '',
    required: true,
    displayOptions: { show: { resource: ['customField'], operation: ['create'] } },
  },
  {
    displayName: 'Type',
    name: 'type',
    type: 'options',
    options: [
      { name: 'Text', value: 'TEXT' },
      { name: 'Single Select', value: 'SINGLE_SELECT' },
      { name: 'Multi Select', value: 'MULTI_SELECT' },
      { name: 'URL', value: 'URL' },
    ],
    default: 'TEXT',
    required: true,
    displayOptions: { show: { resource: ['customField'], operation: ['create'] } },
  },
  {
    displayName: 'Description',
    name: 'description',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['customField'], operation: ['create'] } },
  },
  {
    ...optionsField,
    displayOptions: {
      show: { resource: ['customField'], operation: ['create'], type: ['SINGLE_SELECT', 'MULTI_SELECT'] },
    },
  },

  // update
  {
    displayName: 'Custom Field Name or ID',
    name: 'customFieldId',
    type: 'options',
    typeOptions: { loadOptionsMethod: 'getCustomFields' },
    default: '',
    required: true,
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
    displayOptions: { show: { resource: ['customField'], operation: ['update'] } },
  },
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['customField'], operation: ['update'] } },
  },
  {
    displayName: 'Description',
    name: 'description',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['customField'], operation: ['update'] } },
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'fixedCollection',
    placeholder: 'Add Option',
    default: {},
    typeOptions: { multipleValues: true },
    description: 'Required for Single Select and Multi Select fields. To edit an existing option, its Option ID must be set — leave blank to add a new option instead.',
    displayOptions: { show: { resource: ['customField'], operation: ['update'] } },
    options: [
      {
        displayName: 'Option',
        name: 'option',
        values: [
          {
            displayName: 'Option ID',
            name: 'id',
            type: 'string',
            default: '',
            description: 'Leave blank when adding a new option. Set to an existing option\'s ID (from Custom Field > Get Many) to rename or recolor it instead of creating a duplicate.',
          },
          {
            displayName: 'Label',
            name: 'label',
            type: 'string',
            default: '',
            required: true,
          },
          {
            displayName: 'Color',
            name: 'color',
            type: 'color',
            default: '#74d44e',
          },
        ],
      },
    ],
  },

  // archive / delete
  {
    displayName: 'Custom Field Name or ID',
    name: 'customFieldId',
    type: 'options',
    typeOptions: { loadOptionsMethod: 'getCustomFields' },
    default: '',
    required: true,
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
    displayOptions: { show: { resource: ['customField'], operation: ['archive', 'delete'] } },
  },

  // restore
  {
    displayName: 'Custom Field Name or ID',
    name: 'customFieldId',
    type: 'options',
    typeOptions: { loadOptionsMethod: 'getArchivedCustomFields' },
    default: '',
    required: true,
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
    displayOptions: { show: { resource: ['customField'], operation: ['restore'] } },
  },

  // getAll
  {
    displayName: 'Status',
    name: 'status',
    type: 'options',
    options: [
      { name: 'Active', value: 'ACTIVE' },
      { name: 'Archived', value: 'ARCHIVED' },
    ],
    default: 'ACTIVE',
    displayOptions: { show: { resource: ['customField'], operation: ['getAll'] } },
  },
];
