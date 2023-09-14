# `@samialdury/create`

[![CI status](https://github.com/samialdury/create/actions/workflows/ci.yml/badge.svg)](https://github.com/samialdury/create/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/samialdury/create)](LICENSE)
[![npm version](https://img.shields.io/npm/v/%40samialdury/create)](https://www.npmjs.com/package/@samialdury/create)

CLI tool to create new projects from my templates.

## Usage

The recommended way to use this CLI is through [bunx](https://bun.sh/docs/cli/bunx):

```sh
bunx @samialdury/create
```

You will be prompted to choose a template and provide a project name.

## Available templates

- [Node.js project](https://github.com/samialdury/nodejs-project)
  - Node.js project template designed to get you up and running quickly, whether you're building a CLI tool or a web server.
  - Stack:
    - Node.js
    - TypeScript
    - ESLint
    - Prettier
    - Docker
    - GitHub Actions & GitHub Container Registry
- [Node.js API](https://github.com/samialdury/nodejs-api)
  - Batteries-included Node.js API template with best practices in mind.
  - Includes everything from the Node.js project template, plus:
    - REST
    - GraphQL
    - PostgreSQL
    - OAuth2 & JWT
    - Pulumi IaC
    - Docker Compose
    - local HTTPS
    - GitHub Actions & GitHub Container Registry

## CLI options

```sh
Usage: @samialdury/create [options] <template> <project-name>

Options:
  -h, -H, --help, help          Print this message
  -v, -V, --version, version    Print the CLI version

Arguments:
  <template>                    The template to use. Must be one of:
        nodejs-api              Node.js API template
        nodejs-project          Node.js project template

    If no template is specified, you will be prompted to choose one.

  <project-name>                The name/directory of the project

    If no name/directory is specified, you will be prompted to enter one.
```

## License

[MIT](LICENSE)
