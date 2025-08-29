<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Interactive Garden Map: Developer & Deployment Guide

This document provides a comprehensive overview of the Interactive Garden Map application, including its architecture, how to customize it, and a step-by-step guide for deploying it to services like GitHub Pages.

View your app in AI Studio: https://ai.studio/apps/drive/1hXLYMNRM1Kq-neUCg96QWIPpSAtbMn8E

## How It Works

### Application Overview

The Interactive Garden Map is a dynamic web application built with React to visualize, manage, and track the history of trees in a garden. Key features include:

-   **Interactive Map:** A zoomable, pannable map of the garden with tree markers.
-   **Historical View:** Ability to view the garden's state at different points in time.
-   **Compare Mode:** A diffing tool to visually compare the garden state between two dates, highlighting added, removed, moved, or modified trees.
-   **Edit Mode:** Functionality to add, move, delete, and modify tree information. Changes can be saved as new versions.
-   **AI-Powered Info:** Utilizes the Gemini API to provide rich, dynamically generated information about tree species.
-   **Multilingual Support:** The interface is available in both Spanish (Castellano) and Galician (Galego).

### Core Concepts

-   **Garden State:** The core data model is a `GardenState` object, which represents the garden at a specific `date`. It contains an array of `Tree` objects.
-   **Versioning:** The application manages different versions of the garden state. A `manifest.json` file lists official, deployed versions. Users can also create and save new versions locally, which are stored in the browser's Local Storage.
-   **Data Persistence:**
    -   **Base Versions:** Loaded from JSON files specified in `data/manifest.json`. These are considered the "source of truth".
    -   **Local Versions:** When a user saves changes in Edit Mode, the new `GardenState` is saved to Local Storage. This allows for user-generated versions without modifying the base data files.
-   **Data Import/Export:** Users can download any garden state as a JSON file and import a JSON file to add it to their local history.

### Component Architecture

The application is structured around several key React components:

-   `App.tsx`: The main component that manages application state, including the current garden data, edit/compare modes, and user interactions.
-   `GardenMap.tsx`: Renders the map background and all the `TreeMarker` components. It also handles rendering the "moved" arrows in compare mode.
-   `Toolbar.tsx`: The main user interface for controlling the application. It provides controls for date selection, mode switching (view, edit, compare), filtering, and other actions like saving, importing, and exporting data.
-   `TreeMarker.tsx`: Represents a single tree on the map. Its appearance (color, size, icon) changes based on its status, size, and type. It's also responsible for handling click events.
-   `TreeInfoModal.tsx`: A modal dialog that displays detailed information about a selected tree. In view mode, it shows static and AI-generated data. In edit mode, it becomes a form for modifying the tree's properties.

### Gemini API Integration

When a user clicks the "Learn More" button in the `TreeInfoModal`, the application sends a request to the Gemini API (`gemini-2.5-flash` model).

-   **Prompting:** A structured prompt is created asking for information about the specific tree species in the user's selected language. The expected output is defined using a JSON schema.
-   **Response:** The Gemini API returns a JSON object containing a summary, characteristics, care instructions, and a fun fact about the tree.
-   **Caching:** To reduce API calls and improve performance, successfully fetched information is cached in a module-level `Map`. Subsequent requests for the same tree in the same language will use the cached data.

---

## Deploying to GitHub Pages

This section provides a step-by-step guide to deploying the application to GitHub Pages. This process has been tested and includes solutions to common issues.

### 1. Project Structure for Static Assets (Crucial Step)

For the deployment to work, Vite needs to know which files to copy directly into the final build output. These are "static assets" that are not directly imported into the application's code, like JSON files, images, or fonts.

Vite uses a special directory named `public` at the project root for this purpose.

**Action Required:**
1.  Create a directory named `public` at the root of your project if it doesn't exist.
2.  Move the `data` directory (containing all `*.json` files) into the `public` directory.
3.  Move the `i18n/locales` directory (containing `es.json` and `gl.json`) into the `public` directory.

The final structure should look like this:
```
.
├── public/
│   ├── data/
│   │   ├── 2024-05-25.json
│   │   └── ...
│   └── locales/
│       ├── es.json
│       └── gl.json
├── src/
│   ├── App.tsx
│   ├── i18n/
│   │   ├── LanguageContext.tsx
│   │   └── config.ts
│   └── ...
└── vite.config.ts
```
**Note:** The `src/i18n` directory itself, containing `.tsx` and `.ts` files, must remain in `src` as it is part of the application's source code.

### 2. Code Adjustments for Asset Paths

Because we moved the static assets, we need to update the paths used to fetch them in the code.

-   **File to modify:** `src/i18n/LanguageContext.tsx`
-   **Change:** Update the `fetch` paths to point to the new location. The `public` directory becomes the root of the server, so you can reference the files directly.

    *Original Code:*
    ```typescript
    const esPromise = fetch('i18n/locales/es.json').then(res => res.json());
    const glPromise = fetch('i18n/locales/gl.json').then(res => res.json());
    ```
    *Corrected Code:*
    ```typescript
    const esPromise = fetch('locales/es.json').then(res => res.json());
    const glPromise = fetch('locales/gl.json').then(res => res.json());
    ```
-   **Verification:** The paths in `App.tsx` (for `data/manifest.json`) and `data/manifest.json` (for the individual data files) should already be relative and will work correctly with the new structure.

### 3. Build Configuration (`package.json` and `vite.config.ts`)

**A. Install Dependencies:**
First, ensure you have the necessary development dependencies.
```bash
npm install gh-pages @vitejs/plugin-react --save-dev
```

**B. Configure `package.json`:**
Add the `homepage` URL and the deployment `scripts` to your `package.json`. Replace `<your-username>` and `<your-repo-name>` with your details.
```json
{
  // ... other properties
  "homepage": "https://<your-username>.github.io/<your-repo-name>",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
  // ... other properties
}
```

**C. Configure `vite.config.ts`:**
Ensure your `vite.config.ts` includes the `react` plugin and the correct `base` path. The `base` path must match your repository's name.
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/<your-repo-name>/', // e.g., '/interactive-garden-map/'
});
```

### 4. Deployment Command

Once all the configuration is complete, run the deploy script from your terminal:
```bash
npm run deploy
```
This command will first build the project into the `dist` folder and then push this folder's contents to a branch named `gh-pages`.

### 5. Configure GitHub Pages Source

Finally, you need to tell GitHub to serve your site from the new branch.
1.  Go to your repository's **Settings** on GitHub.
2.  In the sidebar, click on **Pages**.
3.  Under "Build and deployment", for the "Source", select **Deploy from a branch**.
4.  Set the "Branch" to `gh-pages` with the folder `/ (root)`.
5.  Click **Save**.

Your application will be live at the URL you specified in the `homepage` property within a few minutes.

### Troubleshooting

-   **Error: `fatal: a branch named 'gh-pages' already exists`**
    If the `npm run deploy` command fails with this error, it means a previous failed deployment left a `gh-pages` branch behind. To fix this, you may need to delete it both locally and on the remote.
    ```bash
    # Delete the local branch
    git branch -d gh-pages
    # Delete the remote branch
    git push origin --delete gh-pages
    ```
    After deleting the branches, run `npm run deploy` again.

-   **Application loads but texts or data are missing:**
    This is almost always a pathing issue. Double-check that:
    1.  The `data` and `locales` folders are inside the `public` directory.
    2.  The `base` property in `vite.config.ts` is correct (`/your-repo-name/`).
    3.  The `fetch` paths in `LanguageContext.tsx` are correct (e.g., `'locales/es.json'`).

---

## Customization Guide

This guide explains how to extend the application with new tree species and customize their appearance on the map.

### Adding a New Tree Species

1.  **Add Tree Information (`constants.ts`):**
    Open `constants.ts` and add a new entry to the `TREE_NAMES` map. The key must be a new, unique number (ID).

    ```typescript
    // In constants.ts
    [45, { // New Entry
        common: { es: "Tilo", gl: "Tileiro" },
        scientific: "Tilia platyphyllos",
        origin: { es: "Europa.", gl: "Europa." },
        notes: { es: "Conocido por sus flores aromáticas...", gl: "Coñecido polas súas flores..." }
    }]
    ```

2.  **(Optional) Add a Custom Icon (`components/TreeMarker.tsx`):**
    - **Create the Icon:** Add a new icon component (e.g., `LindenIcon`) to a new file in `components/icons/` and export it from `components/icons/index.ts`.
    - **Integrate the Icon:** In `TreeMarker.tsx`:
        - Import the new icon.
        - Create an ID array for the new tree (e.g., `const LINDEN_TREE_IDS = [45];`).
        - In the `renderIcon` function, add a condition to render your new icon: `if (isLindenTree) return <LindenIcon {...iconProps} />;`.

### Customizing Tree Icon Sizes

To ensure visual balance, you can adjust icon sizes based on their visual weight. All configurations are at the top of `components/TreeMarker.tsx`.

1.  **Visual Weight Groups:** Add your new tree's ID array to one of the visual weight groups (`SUPER_HIGH_VISUAL_WEIGHT_TREE_IDS`, `HIGH_VISUAL_WEIGHT_TREE_IDS`, etc.). This will automatically apply a pre-defined size scale.
2.  **(Advanced) Create a New Size Scale:** If needed, you can define a new size configuration object (like `iconSizeSuperHighVisualWeight`) and add logic within `TreeMarker.tsx` to apply it to your new tree type.