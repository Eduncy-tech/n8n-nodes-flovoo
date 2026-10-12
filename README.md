# n8n-nodes-flovoo

Official n8n community node for the [Flovoo](https://flovoo.com) WhatsApp Business API.

## Nodes

- **Flovoo** — action node covering Contacts, Conversations, Messages, Tags, Contact Stages, Segments, Templates, Users, Channels and Webhooks.
- **Flovoo Trigger** — subscribes to a Flovoo webhook automatically when the workflow is activated (and unsubscribes on deactivation), verifies the HMAC-SHA256 signature on every delivery, and starts the workflow with the event payload.

## Credential

**Flovoo API** — an API key generated from the Flovoo dashboard (Settings → API Keys) plus a base URL (defaults to `https://api.flovoo.com`).

## Usage example

**Send a message to a contact**

1. Add the **Flovoo** node to your workflow.
2. Set **Resource** → `Message` and **Operation** → `Send`.
3. Fill in **Conversation ID** (from a previous step or the Flovoo dashboard) and **Contact ID**.
4. Enter the message text in the **Text** field.
5. Execute the node — the message is delivered via WhatsApp.

**Create a contact**

1. Set **Resource** → `Contact` and **Operation** → `Create`.
2. Enter the contact's **Name** and **Phone** (digits only with country code, e.g. `201234567890`).
3. Optionally pick a **Stage** and add **Tags**.
4. Execute — the new contact appears in Flovoo immediately.

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
