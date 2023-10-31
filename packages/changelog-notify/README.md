# @nx-extend/changelog-notify

<a href="https://www.npmjs.com/package/@nx-extend/changelog-notify" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/changelog-notify" alt="@nx-extend/changelog-notify NPM package">
</a>

**Nx plugin to notify you of generated changelogs created by [jscutlery/semver](https://github.com/jscutlery/semver)**.

## Setup

### Install

```sh
npm install -D @nx-extend/changelog-notify
```

## Usage

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

