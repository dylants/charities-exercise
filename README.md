# charities-exercise

A coding exercise to select featured charities.

## Getting Started

_This app expects version 20 (or above) of Node.js._

(Optional) Use nvm to switch to the required version of Node. See [nvm](https://github.com/nvm-sh/nvm) for instructions on how to install and use nvm to install Node.js versions.

```
$ nvm use
```

Install dependencies

```
$ npm install
```

Run the code from the command line, providing charities and profile info CSVs

```
$ npm run command-line <path to charities CSV> <path to profile info CSV>
```

### Additional Scripts

Below are additional scripts used during development, and/or could be used to evaluate the exercise. All these scripts should be optional.

(Optional) Run the exercise using the data stored in source control

```
$ npm start
```

(Optional) Run the exercise in dev mode with nodemon

```
$ npm run dev
```

(Optional) Compile the server files to JavaScript

```
$ npm run build
```

## Configuration

The min/max values which are used in computing the number of charities selected are all stored in the [constants.ts](src/constants.ts) file.

## Lint

ESLint is configured to lint the project files.

To lint the project:

```
$ npm run lint
```

## Tests

Jest is used for unit tests.

To run the tests:

```
$ npm test
```

To run the tests in watch mode:

```
$ npm run test:watch
```
