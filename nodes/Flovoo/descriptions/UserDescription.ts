import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['user'] } },
    options: [{ name: 'Get Many', value: 'getAll', action: 'Get many users' }],
    default: 'getAll',
  },
];

export const userFields: INodeProperties[] = [
  {
    displayName: 'Page Size',
    name: 'limit',
    type: 'number',
    default: 20,
    typeOptions: { minValue: 1, maxValue: 100 },
    displayOptions: { show: { resource: ['user'], operation: ['getAll'] } },
  },
  {
    displayName: 'Page Number',
    name: 'page',
    type: 'number',
    default: 1,
    typeOptions: { minValue: 1 },
    displayOptions: { show: { resource: ['user'], operation: ['getAll'] } },
  },
  {
    displayName: 'Search',
    name: 'search',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['user'], operation: ['getAll'] } },
  },
];
