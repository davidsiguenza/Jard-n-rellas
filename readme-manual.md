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

This section provides a step-by-step guide to deploying the application to GitHub Pages, which typically hosts sites in a subdirectory.

### Prerequisites

-   A GitHub account.
-   A GitHub repository for this project.
-   `node` and `npm` installed locally.
-   The project is set up using Vite (or a similar modern build tool).

### Manual Configuration Checklist

If you are setting up deployment from scratch or restoring a configuration, ensure the following steps are completed.

#### 1. Install `gh-pages`

This package simplifies deploying the build output to a `gh-pages` branch.

```bash
npm install gh-pages --save-dev
```

#### 2. Update `package.json`

Add the following properties to your `package.json` file. Replace `<your-username>` and `<your-repo-name>` with your actual details.

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

#### 3. Create or Update `vite.config.ts`

Create or update a `vite.config.ts` file at the project root. The `base` property is crucial for ensuring assets are loaded correctly from the repository subdirectory on GitHub Pages.

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/<your-repo-name>/', // e.g., '/interactive-garden-map/'
});
```
*Note: This file might not exist in the initial project. It needs to be created to specify the `base` path for deployment.*

#### 4. Ensure Relative Asset Paths

All `fetch` requests in the code must use relative paths, not absolute paths (which start with `/`). This ensures they resolve correctly under the repository subdirectory.

-   **`App.tsx`**: `fetch('/data/manifest.json')` should be `fetch('data/manifest.json')`.
-   **`i18n/LanguageContext.tsx`**: `/i18n/locales/...` paths should be `i18n/locales/...`.
-   **`data/manifest.json`**: All `path` values must be relative (e.g., `"path": "data/2025-08-20.json"` instead of `"/data/..."`).

*These path corrections have been applied to the codebase to facilitate deployment.*

#### 5. Project Structure for Static Assets
Vite automatically handles files in a `public` directory at the root of your project by copying them to the root of the output `dist` folder. If your project does not use a `public` folder, ensure your static asset folders (like `data` and `i18n`) are at the project root alongside `index.html`. The relative paths in the code (`data/...` and `i18n/...`) will work correctly with this structure.

### Deployment Command

Once the configuration is complete, run the deploy script:

```bash
npm run deploy
```

This command will:
1.  Run `npm run build` to create a production build in the `dist` directory.
2.  Run `gh-pages -d dist` to push the contents of the `dist` directory to the `gh-pages` branch of your repository.

### Configure GitHub Pages Source

Finally, go to your repository's settings on GitHub. Under the "Pages" section, select the `gh-pages` branch as the source and save. Your application will be live at the URL you specified in the `homepage` property.

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