# Playground puzzle

This app allows you to scan Playground puzzle pieces, and start a site using WordPress Playground.

with the puzzle pieces you have scanned.

## Installation

To install the app, you need to have Node.js installed on your computer. You can download it from [here](https://nodejs.org/).

After you have installed Node.js, you can install the app by running the following command in the project directory:

```bash
npm install
```

## Configuration

Before you can start the app, you need to configure the app by creating a `.env` file in the project directory. You can copy the `.env.example` file and rename it to `.env`. You can then set the following variables in the `.env` file:

- `REACT_APP_OPENAI_API_KEY`: Your OpenAI API key. You can get it from the [OpenAI dashboard](https://platform.openai.com/api-keys). The API key needs Model capabilities and must have a connected billing account to access GPT-4.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

