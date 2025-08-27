# Deployment Guide

This document explains how to deploy the Interactive Garden Map application to GitHub Pages using the automated GitHub Actions workflow.

## Automated Deployment with GitHub Actions

A GitHub Actions workflow has been set up to automatically build and deploy the application to GitHub Pages.

### How it Works

1.  **Trigger:** The workflow is triggered automatically whenever new changes are pushed to the `main` branch.
2.  **Build:** The workflow checks out the code, installs the necessary Node.js dependencies, and builds the application for production using `npm run build`.
3.  **Deploy:** The production-ready files from the `dist/` directory are then pushed to a special `gh-pages` branch in the repository.
4.  **Publish:** GitHub Pages is configured to serve the website from the `gh-pages` branch.

The workflow is defined in the file `.github/workflows/deploy.yml`.

## GitHub Pages Configuration

For the deployment to be accessible, you need to configure your repository's GitHub Pages settings.

1.  Go to your repository on GitHub.
2.  Click on the **Settings** tab.
3.  In the left sidebar, click on **Pages**.
4.  Under **Build and deployment**, for **Source**, select **Deploy from a branch**.
5.  Under **Branch**, select the `gh-pages` branch and `/ (root)` folder.
6.  Click **Save**.

Your application will be live at the URL `https://davidsiguenza.github.io/Jard-n-rellas/`. It might take a few minutes for the page to become available after the first deployment.

## Summary of Changes Made

The following changes were made to the codebase to enable automated deployment:

1.  **Added `gh-pages` and `@vitejs/plugin-react` dependencies:**
    -   The `gh-pages` package was added to `devDependencies` in `package.json` to handle deploying the build output to the `gh-pages` branch.
    -   The `@vitejs/plugin-react` package was added because it was a missing dependency required for the project to build correctly with Vite.
2.  **Updated `package.json`:**
    -   Added a `homepage` property with the correct URL for GitHub Pages.
    -   Added `predeploy` and `deploy` scripts to build the application and run the `gh-pages` command.
3.  **Updated `vite.config.ts`:**
    -   Added a `base` property with the correct repository name to ensure that all asset paths work correctly on GitHub Pages.
    -   Added the `@vitejs/plugin-react` to the plugins array.
4.  **Created GitHub Actions Workflow:** A workflow file was added at `.github/workflows/deploy.yml` to automate the entire build and deployment process.
5.  **Created this `DEPLOYMENT.md` file:** This documentation was created to explain the deployment process.
