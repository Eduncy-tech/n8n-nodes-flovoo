import type { INodeProperties } from 'n8n-workflow';

export const channelOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['channel'] } },
    options: [{ name: 'Get Many', value: 'getAll', action: 'Get many channels' }],
    default: 'getAll',
  },
];

export const channelFields: INodeProperties[] = [
  {
    displayName: 'Platform Type',
    name: 'platformType',
    type: 'options',
    options: [
      { name: 'Any', value: '' },
      { name: 'WhatsApp', value: 'WHATSAPP' },
      { name: 'Messenger', value: 'MESSENGER' },
      { name: 'Instagram', value: 'INSTAGRAM' },
      { name: 'Internal', value: 'INTERNAL' },
      { name: 'Widget', value: 'WIDGET' },
    ],
    default: '',
    displayOptions: { show: { resource: ['channel'], operation: ['getAll'] } },
  },
];
