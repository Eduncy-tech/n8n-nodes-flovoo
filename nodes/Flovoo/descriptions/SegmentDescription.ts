import type { INodeProperties } from 'n8n-workflow';

export const segmentOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['segment'] } },
    options: [{ name: 'Get Many', value: 'getAll', action: 'Get many segments' }],
    default: 'getAll',
  },
];

export const segmentFields: INodeProperties[] = [];
