import type { INodeProperties } from 'n8n-workflow';

export const tagOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['tag'] } },
    options: [
      { name: 'Get Many', value: 'getAll', action: 'Get many tags' },
      { name: 'Update', value: 'update', action: 'Update a tag' },
      { name: 'Delete', value: 'delete', action: 'Delete a tag' },
    ],
    default: 'getAll',
  },
];

export const tagFields: INodeProperties[] = [
  {
    displayName: 'Tag ID',
    name: 'tagId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: { show: { resource: ['tag'], operation: ['update', 'delete'] } },
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['tag'], operation: ['update'] } },
    options: [
      { displayName: 'Name', name: 'name', type: 'string', default: '' },
      { displayName: 'Color', name: 'color', type: 'color', default: '#74d44e' },
    ],
  },

  {
    displayName: 'Page Size',
    name: 'limit',
    type: 'number',
    default: 20,
    typeOptions: { minValue: 1, maxValue: 100 },
    displayOptions: { show: { resource: ['tag'], operation: ['getAll'] } },
  },
  {
    displayName: 'Page Number',
    name: 'page',
    type: 'number',
    default: 1,
    typeOptions: { minValue: 1 },
    displayOptions: { show: { resource: ['tag'], operation: ['getAll'] } },
  },
];
