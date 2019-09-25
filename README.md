# Botmock Botframework Export

[![Build status](https://ci.appveyor.com/api/projects/status/tgof5738pfqppis7?svg=true)](https://ci.appveyor.com/project/nonnontrivial/botmock-botframework-export)

> Creates Botframework [Language Generation](https://github.com/Microsoft/BotBuilder-Samples/tree/master/experimental/language-generation#language-generation-preview) files from a Botmock project for use with .NET, C#, or Node JS Bot Framework projects.

These files are able to be used within .NET, C#, or Node JS projects in order to take advantage of the new **[Adaptive Dialog]**(https://github.com/microsoft/BotBuilder-Samples/tree/master/experimental/adaptive-dialog#adaptive-dialog-preview) paradigm in Bot Framework.

## Prerequisites

- [.NET Core SDK](https://dotnet.microsoft.com/download) version 2.1.x

```bash
# determine dotnet version
dotnet --version
```

## Guide

- clone this repository: `git clone git@github.com:Botmock/botmock-botframework-export.git`
- run `npm install`
- run `npm start`
- create `.env` (see Env section below for more on this)
- find generated `.lg` file in `/output`.
- move generated file to your project directory
- [reference generated file in your existing C# code](https://github.com/microsoft/BotBuilder-Samples/blob/master/experimental/adaptive-dialog/docs/language-generation.md).

### Env

The script relies on a `.env` file that holds Botmock credentials for your project.

The file should look like so:

```shell
BOTMOCK_TOKEN=your-token
BOTMOCK_TEAM_ID=your-team-id
BOTMOCK_PROJECT_ID=your-project-id
BOTMOCK_BOARD_ID=your-board-id

```
