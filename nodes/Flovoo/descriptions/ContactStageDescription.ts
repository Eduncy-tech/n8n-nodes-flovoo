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
      {
        name: 'Update',
        value: 'update',
        action: 'Update a stage',
        description: 'Rename a stage, change its color, or change its description',
      },
      {
        name: 'Delete',
        value: 'delete',
        action: 'Delete a stage',
        description: 'Permanently delete a stage, moving its contacts to another stage',
      },
    ],
    default: 'getAll',
  },
];

export const stageFields: INodeProperties[] = [
  {
    displayName: 'Stage Name or ID',
    name: 'stageId',
    type: 'options',
    typeOptions: { loadOptionsMethod: 'getStages' },
    default: '',
    required: true,
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
    displayOptions: { show: { resource: ['contactStage'], operation: ['delete'] } },
  },
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['contactStage'], operation: ['update'] } },
  },
  {
    displayName: 'Stage Name or ID',
    name: 'stageId',
    type: 'options',
    typeOptions: { loadOptionsMethod: 'getStages' },
    default: '',
    required: true,
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
    displayOptions: { show: { resource: ['contactStage'], operation: ['update'] } },
  },
  {
    displayName: 'Color',
    name: 'color',
    type: 'color',
    default: '#74d44e',
    displayOptions: { show: { resource: ['contactStage'], operation: ['update'] } },
  },
  {
    displayName: 'Description',
    name: 'description',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['contactStage'], operation: ['update'] } },
  },
  {
    displayName: 'Transfer To Stage Name or ID',
    name: 'transferToStageId',
    type: 'options',
    typeOptions: { loadOptionsMethod: 'getStagesExcludingSelected' },
    default: '',
    required: true,
    description: 'Contacts on the deleted stage move here. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
    displayOptions: { show: { resource: ['contactStage'], operation: ['delete'] } },
  },
];
