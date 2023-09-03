# FreshBites Frontend

This is the frontend repository for FreshBites, a platform for food lovers and restaurant owners. Built using React,
this repository contains all the necessary components, assets, and utilities for a seamless user experience.

## Project Structure

Below is a brief explanation of the folder structure.

- `package.json` and `package-lock.json`: These files are used by npm for managing dependencies.
- `public/`: This directory contains static files that can be served by the server such as the favicon, logo, and HTML
  entry point (`index.html`).
- `src/`: The `src` folder contains all the source code for the React application.

### Inside `src/`

- `assets/`: This folder contains all the static resources used in the project. For instance, `FreshBitesLogoWeiß.svg`
  and `FreshBitesSchriftzugWeiß.svg` are kept here.
- `components/`: It's home to all React components used throughout the application, organized by feature (
  e.g., `auth`, `blog`, `common`, `informtion`, `owner`, `payment`, `restaurant`, `visitor`). Each subfolder corresponds
  to a specific feature or context of our application.
- `index.js`: This file is entry point of our application.
- `Layout.js`: This file defines the main layout of the application.
- `pages/`: This folder contains all the main view files or pages in our application.
- `reportWebVitals.js`: This is used for measuring and reporting web vitals, which are metrics for a healthy site.
- `Router.js`: This file handles all the routing logic of our application.
- `styles/`: This directory contains global styles for the application, including the theme
  provider (`ThemeProvider.js`).
- `utils/`: This directory contains utility functions and providers, such as `AuthProvider.js` and `LoginProvider.js`.

To learn more about each file and folder, navigate into them and explore. Each component and page should have its own
specific responsibilities and they all come together to create the overall FreshBites frontend.

This project structure allows for better scalability, manageability, and ease of understanding even as the project
grows. Feel free to explore and contribute!
