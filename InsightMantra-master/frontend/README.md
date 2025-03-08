# InsightMantra

# Frontend Project

## Description

This is a frontend project built with HTML, CSS, JavaScript, React, Chart.js, and Tailwind CSS. The project visualizes data using interactive charts and provides a responsive user interface.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [Credits](#credits)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/your-repo-name.git
    ```

2. Navigate to the project directory:

    ```bash
    cd your-repo-name
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

## Usage

1. Start the development server:

    ```bash
    npm run dev 
    ```

    The application will run on `http://localhost:3000`.

## Project Structure

```bash
your-repo-name/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   ├── Hero.jsx(Landing Page)
│   │   └── ...
│   ├── styles/
│   │   ├── tailwind.css
│   │   └── ...
│   ├── App.js
│   ├── index.js
│   └── ...
├── .gitignore
├── package.json
├── tailwind.config.js
└── README.md

```
## Available Scripts
In the project directory, you can run:

```npm start```
Runs the app in the development mode.<br>
Open http://localhost:3000 to view it in the browser.

```npm run build```
Builds the app for production to the build folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

## Configuration
Configuration for Tailwind CSS is managed in the tailwind.config.js file. You can customize the Tailwind CSS configuration to suit your needs.

## Example Configuration
javascript
Copy code
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

## Contributing
* Contributions are welcome! Please follow these steps to contribute:

* Fork the repository.
* Create a new branch (git checkout -b feature-branch).
* Make your changes.
* Commit your changes (git commit -m 'Add some feature').
* Push to the branch (git push origin feature-branch).
* Open a pull request.

## Credits
* This project was inspired by and uses code from the Brainwave repository by Adrian Hajdin.
