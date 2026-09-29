import type { INodeProperties } from 'n8n-workflow';

export const channelOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['channel'] } },
    options: [
      {
        name: 'Get Many',
        value: 'getAll',
        action: 'Get many channels',
        description: 'Return every connected channel (WhatsApp, Messenger, Instagram...)',
      },
    ],
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
      { name: 'Instagram', value: 'INSTAGRAM' },
      { name: 'Internal', value: 'INTERNAL' },
      { name: 'Messenger', value: 'MESSENGER' },
      { name: 'WhatsApp', value: 'WHATSAPP' },
      { name: 'Widget', value: 'WIDGET' },
    ],
    default: '',
    displayOptions: { show: { resource: ['channel'], operation: ['getAll'] } },
  },
];
