# Deployment Process Log

This document details the step-by-step process followed to deploy the Interactive Garden Map application to GitHub Pages, including troubleshooting steps.

## 1. Initial Exploration and Planning

-   **Goal:** Deploy the application to GitHub Pages, preferably using GitHub Actions.
-   **Initial Steps:**
    -   Listed files with `ls` to understand the project structure.
    -   Read `readme-manual.md` to understand the existing (manual) deployment instructions. This file provided the core requirements for a successful deployment.
    -   Read `package.json` and `vite.config.ts` to check the current configuration.
    -   Identified that `package.json` was missing `homepage`, `deploy` scripts, and the `gh-pages` dependency. `vite.config.ts` was missing the `base` property.
    -   Created an initial plan to set up an automated deployment with GitHub Actions.

## 2. Setting up GitHub Pages Deployment

-   Installed the `gh-pages` package as a dev dependency using `npm install gh-pages --save-dev`.
-   Updated `package.json` to add the `homepage` property and the `predeploy` and `deploy` scripts.
-   Updated `vite.config.ts` to add the `base` property required for correct asset pathing on GitHub Pages.
-   Created a GitHub Actions workflow file at `.github/workflows/deploy.yml` to automate the build and deployment process on every push to the `main` branch.

## 3. First Deployment Attempt and Troubleshooting

The initial setup led to a few issues that were resolved iteratively.

### Issue 1: Missing React Plugin
-   **Problem:** The first attempt to build the project with `npm run build` failed with an error: `Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@vitejs/plugin-react'`.
-   **Solution:** The `vite.config.ts` file was configured to use the React plugin, but the package itself was not listed in `package.json`. I installed it as a dev dependency (`npm install @vitejs/plugin-react --save-dev`) to resolve the build error.

### Issue 2: Placeholders in Configuration
-   **Problem:** The code review pointed out that I had used placeholders like `<your-username>` and `<your-repo-name>` in `package.json` and `vite.config.ts`. This would have caused the deployment to fail.
-   **Solution:** I requested the user's GitHub repository URL (`https://github.com/davidsiguenza/Jard-n-rellas`) and used it to set the correct values for the `homepage` and `base` properties.

### Issue 3: Git Author Identity Unknown in GitHub Actions
-   **Problem:** The first execution of the GitHub Actions workflow failed with an `Author identity unknown` error. This happened because the `gh-pages` script needs to make a Git commit to the `gh-pages` branch, and no user was configured in the CI environment.
-   **Solution:** I updated the `.github/workflows/deploy.yml` file to add a step that configures a git user name and email (`github-actions[bot]`) before the deployment script is run.

### Issue 4: Static Assets Not Loading
-   **Problem:** After the first successful deployment, the historical data files (`.json`) and translation files were not loading on the live site, resulting in errors.
-   **Solution:**
    -   I identified that static assets that are not directly imported into the application (like the JSON data files) must be placed in the `public` directory for Vite to include them in the build output.
    -   I created a `public` directory.
    -   I moved the `data` directory (containing all historical data) into `public`.
    -   I moved the `i18n/locales` directory (containing the translation files) into `public/i18n`. The rest of the `i18n` source files, which are imported by the application, remained at the project root. This resolved the 404 errors for the static assets.

## 4. Final Configuration

-   After all the fixes, the application was successfully deployed, and all features were working correctly.
-   The GitHub Actions workflow now automatically deploys any new changes pushed to the `main` branch.
-   A `DEPLOYMENT.md` file was created with instructions on the final configuration and how to check the deployment status. This `DEPLOYMENT_LOG.md` file was created to provide a detailed history of the process.
