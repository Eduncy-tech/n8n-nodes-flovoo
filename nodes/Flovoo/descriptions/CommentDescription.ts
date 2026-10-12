import type { INodeProperties } from 'n8n-workflow';

export const commentOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['comment'] } },
    options: [
      {
        name: 'Create',
        value: 'create',
        action: 'Create a comment',
        description: 'Add a comment to a contact, or reply to an existing one',
      },
    ],
    default: 'create',
  },
];

export const commentFields: INodeProperties[] = [
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: { show: { resource: ['comment'], operation: ['create'] } },
  },
  {
    displayName: 'Content',
    name: 'content',
    type: 'string',
    typeOptions: { rows: 3 },
    default: '',
    required: true,
    displayOptions: { show: { resource: ['comment'], operation: ['create'] } },
  },
  {
    displayName: 'Reply To Comment ID',
    name: 'parentId',
    type: 'string',
    default: '',
    description: 'Leave empty to post a top-level comment instead of a reply',
    displayOptions: { show: { resource: ['comment'], operation: ['create'] } },
  },
];
