<p align="center">
<img src="https://github.com/mobeigi/chessort/blob/main/.github/logo/logo.svg?raw=true" height="110px" width="auto"/>
<br/>
<h3 align="center">Chessort App</h3>
<p align="center">React frontend for Chessort.</p>
<h2></h2>
<br />

<p align="center">
<a href="../../releases"><img src="https://img.shields.io/github/release/mobeigi/chessort.svg?style=flat-square" /></a>
<a href="../../actions"><img src="https://img.shields.io/github/actions/workflow/status/mobeigi/chessort/workflow.yml?style=flat-square" /></a>
<a href="../../issues"><img src="https://img.shields.io/github/issues/mobeigi/chessort.svg?style=flat-square" /></a>
<a href="../../pulls"><img src="https://img.shields.io/github/issues-pr/mobeigi/chessort.svg?style=flat-square" /></a> 
<a href="LICENSE.md"><img src="https://img.shields.io/github/license/mobeigi/chessort.svg?style=flat-square" /></a>
</p>

## Description

This is a React app that allows you to play the Chessort game.  
Written using React + Vite.

## Setup

1. **Copy and Configure .env File**:

   - Copy the `.env.example` file to `.env`:
     ```sh
     cp .env.example .env
     ```
   - Populate the `.env` file with your details.

2. **Install depdendencies**:

   - Install all of the required dependencies:
     ```sh
     yarn
     ```

## Available Scripts

#### `yarn start`

Runs the app in the development mode.  
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

Hot reloading is enabled.

#### `yarn build`

Builds the app for production to the `dist` folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.

#### `yarn lint`

Run ESLint against all source files.

#### `yarn clean`

Clean up temporary directories like `node_modules` and `build`.  
