# n8n-nodes-flovoo

Official n8n community node for the [Flovoo](https://flovoo.com) WhatsApp Business API.

## Nodes

- **Flovoo** — action node covering Contacts, Conversations, Messages, Tags, Contact Stages, Segments, Templates, Users, Channels and Webhooks.
- **Flovoo Trigger** — subscribes to a Flovoo webhook automatically when the workflow is activated (and unsubscribes on deactivation), verifies the HMAC-SHA256 signature on every delivery, and starts the workflow with the event payload.

## Credential

**Flovoo API** — an API key generated from the Flovoo dashboard (Settings → API Keys) plus a base URL (defaults to `https://api.flovoo.com`).

## Development

```bash
pnpm install
pnpm build
```

To test locally against a running n8n instance:

```bash
pnpm build
npm link
cd ~/.n8n/custom   # or wherever N8N_CUSTOM_EXTENSIONS points
npm link n8n-nodes-flovoo
```

## Publishing

```bash
pnpm build
npm publish
```
