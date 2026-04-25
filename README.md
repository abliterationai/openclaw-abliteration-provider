# Abliteration Provider for OpenClaw

Third-party [Abliteration.ai](https://abliteration.ai) model provider plugin for
OpenClaw.

## Install

After the package is published to ClawHub or npm:

```bash
openclaw plugins install @abliterationai/openclaw-abliteration-provider
openclaw plugins enable abliteration
openclaw gateway restart
```

For local development from this repository:

```bash
npm install
openclaw plugins install .
openclaw plugins enable abliteration
openclaw gateway restart
```

## Configure

Run onboarding with an API key:

```bash
openclaw onboard --auth-choice abliteration-api-key
```

For non-interactive setup:

```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice abliteration-api-key \
  --abliteration-api-key "$ABLITERATION_API_KEY" \
  --skip-health \
  --accept-risk
```

The plugin registers:

- Provider id: `abliteration`
- API key env var: `ABLITERATION_API_KEY`
- Default model: `abliteration/abliterated-model`
- API: OpenAI Responses
- Base URL: `https://api.abliteration.ai/v1`

## Development

```bash
npm test
npm run typecheck
npm run pack:dry-run
```

Publish on ClawHub after GitHub is pushed:

```bash
clawhub package publish abliterationai/openclaw-abliteration-provider
```
