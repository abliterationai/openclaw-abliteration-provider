---
name: openclaw-abliteration-provider
description: Abliteration.ai OpenClaw provider plugin. Requires ABLITERATION_API_KEY.
version: 0.1.1
metadata:
  openclaw:
    requires:
      env:
        - ABLITERATION_API_KEY
    primaryEnv: ABLITERATION_API_KEY
    homepage: https://github.com/abliterationai/openclaw-abliteration-provider
---

# Abliteration.ai Provider Plugin

This package is an OpenClaw code plugin, not an autonomous agent skill. It
registers the Abliteration.ai text-inference provider for OpenClaw.

Runtime credential:

- `ABLITERATION_API_KEY`: Abliteration.ai API key used only for requests to
  `https://api.abliteration.ai/v1`.

Configure the key through OpenClaw onboarding or your environment. Do not paste
real API keys into public chats, logs, issues, or pull requests.
