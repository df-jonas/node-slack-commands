# Node.JS Slack Commands

Node.JS CLI-tool to manage and maintain slack workspaces.

# Installation
## Environment

[Node.JS](http://nodejs.org/) is easy to install and includes [npm](https://npmjs.org/) (Node Package Manager). You should be able to run the following command in your CLI if both are correctly installed on your machine.
```
> node --version
> npm --version
```

## Download
```
> git clone https://github.com/df-jonas/node-slack-commands.git
> cd node-slack-commands
> npm install
```

## Configure

Copy `.properties.example` to `.properties` then edit it with your own settings:
- `token`: Your own slack API token

## Update

Some packages might change after some time, so you should run `npm prune` & `npm install` often. A common way to update is by doing

```
> git pull
> npm prune
> npm install
```

# Usage 

## Clean

You can use the following arguments:
- `channel`: The channel ID **(required)**
- `token`: Override the token provided in `.properties`
- `user`: Only delete messages of a specific user
- `private`: Set to `true` if the channel is private
- `delay`: Customize delay between requests
- `staging`: Set to `true` to test you command without deleting anything

Examples:

```
> node slack-messages clean --channel AABBCCDD

> node slack-messages clean --channel AABBCCDD --user WWXXYYZZ

> node slack-messages clean --channel AABBCCDD --user WWXXYYZZ --staging true

> node slack-messages clean --channel AABBCCDD --user WWXXYYZZ -- private true --staging true
```