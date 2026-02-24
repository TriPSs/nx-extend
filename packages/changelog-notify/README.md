# @nx-extend/changelog-notify

<a href="https://www.npmjs.com/package/@nx-extend/changelog-notify" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/changelog-notify" alt="@nx-extend/changelog-notify NPM package">
</a>

**Nx plugin to send notifications about generated changelogs to various platforms**.

## Features

- Send changelog notifications to Google Chat
- Integration with [@jscutlery/semver](https://github.com/jscutlery/semver)
- Automatic notification on version releases
- Configurable as post-target for version bumps

## Setup

### Prerequisites

- [@jscutlery/semver](https://github.com/jscutlery/semver) configured in your workspace

### Install

```sh
npm install -D @nx-extend/changelog-notify
```

## Usage

### Google Chat Notifications

Add the `send-release-to-chat` target to your project's `project.json` and configure it as a post-target for versioning:

```json
{
  "version": {
    "executor": "@jscutlery/semver:version",
    "options": {
      ...options
    },
    "configurations": {
      "production": {
        "postTargets": [
          "<this project name>:send-release-to-chat"
        ]
      }
    }
  },
  "send-release-to-chat": {
    "executor": "@nx-extend/changelog-notify:google-chat",
    "options": {
      "tag": "${tag}",
      "notes": "${notes}"
    }
  }
}
```

## Available Options

| Name        | Type     | Default | Description                                |
|-------------|----------|---------|--------------------------------------------|
| **`tag`**   | `string` | -       | Version tag from semver (use `${tag}`)     |
| **`notes`** | `string` | -       | Release notes from semver (use `${notes}`) |

## How It Works

1. When you run the version command with the production configuration, it will bump your version
2. After the version is bumped, the `postTargets` are executed
3. The `send-release-to-chat` target sends the release information to your configured Google Chat webhook

## Environment Variables

Make sure to set your Google Chat webhook URL in the appropriate environment variable or configuration file as required by your project setup.
