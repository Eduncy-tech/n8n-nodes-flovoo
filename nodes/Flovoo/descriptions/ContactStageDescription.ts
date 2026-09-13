import type { INodeProperties } from 'n8n-workflow';

export const contactStageOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['contactStage'] } },
    options: [
      { name: 'Get Many', value: 'getAll', action: 'Get many stages' },
      { name: 'Update', value: 'update', action: 'Update a stage' },
      { name: 'Delete', value: 'delete', action: 'Delete a stage' },
    ],
    default: 'getAll',
  },
];

export const contactStageFields: INodeProperties[] = [
  {
    displayName: 'Stage ID',
    name: 'stageId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: { show: { resource: ['contactStage'], operation: ['update', 'delete'] } },
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['contactStage'], operation: ['update'] } },
    options: [
      { displayName: 'Name', name: 'name', type: 'string', default: '' },
      { displayName: 'Color', name: 'color', type: 'color', default: '#74d44e' },
      { displayName: 'Description', name: 'description', type: 'string', default: '' },
    ],
  },
  {
    displayName: 'Transfer To Stage ID',
    name: 'transferToStageId',
    type: 'string',
    default: '',
    required: true,
    description: 'Contacts on the deleted stage move here',
    displayOptions: { show: { resource: ['contactStage'], operation: ['delete'] } },
  },
];
