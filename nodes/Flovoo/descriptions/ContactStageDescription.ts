import type { INodeProperties } from 'n8n-workflow';

export const stageOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['contactStage'] } },
    options: [
      {
        name: 'Get Many',
        value: 'getAll',
        action: 'Get many stages',
        description: 'Return every stage',
      },
    ],
    default: 'getAll',
  },
];

export const stageFields: INodeProperties[] = [];
