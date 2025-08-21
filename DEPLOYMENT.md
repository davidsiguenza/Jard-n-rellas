# Deploying to GitHub Pages

This document explains how to deploy the interactive garden map application to GitHub Pages.

## Prerequisites

- You have a GitHub account.
- You have created a repository on GitHub for this project.
- You have `node` and `npm` installed on your local machine.

## Deployment Steps

1. **Clone the repository:**

   ```bash
   git clone <your-repository-url>
   cd <repository-name>
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Update `package.json`:**

   Open the `package.json` file and update the `homepage` property with your GitHub username and repository name.

   ```json
   "homepage": "https://<your-username>.github.io/<your-repository-name>"
   ```

   For example, if your username is `my-user` and your repository name is `interactive-garden-map`, the `homepage` property should be:

   ```json
   "homepage": "https://my-user.github.io/interactive-garden-map"
   ```

4. **Deploy the application:**

   Run the following command to build and deploy the application to GitHub Pages:

   ```bash
   npm run deploy
   ```

   This command will create a `gh-pages` branch in your repository and push the built application to it.

5. **Configure GitHub Pages:**

   - Go to your repository's settings on GitHub.
   - In the "Pages" section, select the `gh-pages` branch as the source for your GitHub Pages site.
   - Save the changes.

Your application should now be deployed to the URL specified in the `homepage` property of your `package.json` file.
