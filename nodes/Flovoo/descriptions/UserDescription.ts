import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['user'] } },
    options: [
      {
        name: 'Get Many',
        value: 'getAll',
        action: 'Get many users',
        description: 'Return a page of your organization\'s members — use an ID here as a contact\'s assignee',
      },
    ],
    default: 'getAll',
  },
];

export const userFields: INodeProperties[] = [
  {
    displayName: 'Page Size',
    name: 'limit',
    type: 'number',
    description: 'Max number of results to return',
    default: 50,
    typeOptions: { minValue: 1 },
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
