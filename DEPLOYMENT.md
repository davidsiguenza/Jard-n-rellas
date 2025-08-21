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

## Managing Historical Data

The historical data for the garden is stored in JSON files in the `public/data` directory.
The `public/data/manifest.json` file contains a list of all available data files and their corresponding dates.

To add a new historical data file, you need to:
1.  Add the new JSON file to the `public/data` directory.
2.  Update the `public/data/manifest.json` file to include the new file's date and path.

For example, to add a new data file for `2025-09-01`, you would:
1.  Add the file `2025-09-01.json` to the `public/data` directory.
2.  Add a new entry to the `versions` array in `public/data/manifest.json`:
    ```json
    {
      "date": "2025-09-01",
      "path": "data/2025-09-01.json"
    }
    ```

---

## Manual Configuration Checklist

This section provides a checklist of the manual changes required to configure this project for GitHub Pages deployment. This is useful if the project files are overwritten by an external tool (like AI Studio) and the deployment configuration needs to be restored.

### 1. File and Directory Structure

Ensure the following directory structure exists. The key is to have a `public` directory at the root, which contains the `data` directory.

```
.
├── public/
│   └── data/
│       ├── 2024-05-25.json
│       ├── 2025-08-01.json
│       ├── ... (other data files)
│       └── manifest.json
├── src/
│   └── ... (source files)
└── ... (other project files)
```

### 2. `package.json` Modifications

The following changes need to be made to `package.json`:

- **Install `gh-pages` dependency:**
  ```bash
  npm install gh-pages --save-dev
  ```

- **Add `homepage` property:**
  Add a `homepage` property. Replace `<username>` and `<repo-name>` with your actual GitHub username and repository name.
  ```json
  "homepage": "https://<username>.github.io/<repo-name>",
  ```

- **Add `deploy` scripts:**
  Add the `predeploy` and `deploy` scripts to the `scripts` section.
  ```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  ```

### 3. `vite.config.ts` Modifications

Add the `base` property to the Vite configuration object. The value should be your repository name, surrounded by slashes.

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
// ... other imports

export default defineConfig({
  base: '/interactive-garden-map/', // Or your repository name
  // ... other configurations
});
```

### 4. Code Changes in `App.tsx`

The `fetch` call for `manifest.json` needs to use a **relative path**.

- **Find this line:**
  ```typescript
  const response = await fetch('/data/manifest.json');
  ```

- **Change it to:**
  ```typescript
  const response = await fetch('data/manifest.json');
  ```

### 5. Data File Path Correction in `manifest.json`

The paths inside `public/data/manifest.json` must also be **relative**.

- **Ensure paths look like this (no leading slash):**
  ```json
  {
    "versions": [
      {
        "date": "2025-08-20",
        "path": "data/2025-08-20.json"
      },
      // ...
    ]
  }
  ```
