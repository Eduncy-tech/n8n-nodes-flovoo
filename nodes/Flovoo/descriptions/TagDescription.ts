import type { INodeProperties } from 'n8n-workflow';

export const tagOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['tag'] } },
    options: [
      {
        name: 'Get Many',
        value: 'getAll',
        action: 'Get many tags',
        description: 'Return a page of tags',
      },
      {
        name: 'Update',
        value: 'update',
        action: 'Update a tag',
        description: "Rename a tag or change its color",
      },
      {
        name: 'Delete',
        value: 'delete',
        action: 'Delete a tag',
        description: 'Permanently delete a tag and remove it from every contact',
      },
    ],
    default: 'getAll',
  },
];

export const tagFields: INodeProperties[] = [
  {
    displayName: 'Tag',
    name: 'tagId',
    type: 'options',
    typeOptions: { loadOptionsMethod: 'getTags' },
    default: '',
    required: true,
    displayOptions: { show: { resource: ['tag'], operation: ['delete'] } },
  },
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['tag'], operation: ['update'] } },
  },
  {
    displayName: 'Tag',
    name: 'tagId',
    type: 'options',
    typeOptions: { loadOptionsMethod: 'getTags' },
    default: '',
    required: true,
    displayOptions: { show: { resource: ['tag'], operation: ['update'] } },
  },
  {
    displayName: 'Color',
    name: 'color',
    type: 'color',
    default: '#74d44e',
    displayOptions: { show: { resource: ['tag'], operation: ['update'] } },
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
