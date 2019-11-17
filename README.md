# Typescript App CLI [![npm package](https://github.com/adrianhdezm/ts-app-cli/workflows/npm%20package/badge.svg)]

Typescript App CLI provides a simple way to start to create typescript based projects using a very opinionated subset of development tools (i.e., Webpack, Prettier, TSLint, etc.).

## How to use it

Currently, we support two types of templates, `web` for projects that will run in the browser (e.g, SPA) and `node` for the remaining environments (e.g., web-server). 

For creating a node based project

```sh
npx ts-app-cli -t web my-app
cd my-app
npm start
```

For creating a single-page applications

```sh
npx ts-app-cli -t web my-app
cd my-app
npm start
```

## Motivation

In the past, we use to create boilerplates and example projects, mainly for building single-page applications, yet this has some limitations, such as adapting the names, removing unnecessary code, etc. We don't think that only by using a CLI all the process of changing a boilerplate can be solved, but it provides a mechanism to make some of them very easy (e.g., align project name with a project folder, README.md, and package.json).

## Acknowledgements

This projects is heavily inspired by [Create React App](https://create-react-app.dev). 

## License

TS App CLI is open source software [licensed as MIT](https://github.com/adrianhdezm/ts-app-cli/blob/master/LICENSE).