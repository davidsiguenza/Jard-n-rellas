<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1hXLYMNRM1Kq-neUCg96QWIPpSAtbMn8E


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

## Customization Guide

This guide explains how to extend the application with new tree species and customize the appearance of tree icons on the map.

### Adding a New Tree Species

Follow these steps to add a new type of tree to the application's database.

#### Step 1: Add Tree Information

All tree data is centralized in the `constants.ts` file.

1.  Open `constants.ts`.
2.  Find the `TREE_NAMES` map.
3.  Add a new entry to the map. The key should be a new, unique `number` (ID), and the value should be an object with the tree's information.

**Example:** Adding a "Linden" tree with ID `45`.

```typescript
// In constants.ts, inside the TREE_NAMES map
export const TREE_NAMES: Map<number, TreeInfo> = new Map([
    // ... existing entries
    [44, { /* ... Ciruelo data ... */ }],
    [45, { // New Entry
        common: { es: "Tilo", gl: "Tileiro" }, 
        scientific: "Tilia platyphyllos",
        origin: { es: "Europa.", gl: "Europa." },
        notes: { es: "Conocido por sus flores aromáticas, utilizadas en infusiones relajantes.", gl: "Coñecido polas súas flores aromáticas, utilizadas en infusións relaxantes." }
    }]
]);
```

Once this is done, the "Tilo" will be available in the dropdown menu in the edit modal.

#### Step 2 (Optional): Add a Custom Icon

If you want the new tree species to have a unique icon instead of the default numbered circle, follow these additional steps.

1.  **Create the Icon Component:**
    - Open `components/icons.tsx`.
    - Add a new React component for your SVG icon. Make sure it accepts a `className` prop.

    ```tsx
    // In components/icons.tsx
    export const LindenIcon = ({ className }: { className?: string }) => (
      <svg /* ... your SVG code here ... */ className={className} fill="currentColor">
        {/* ... paths ... */}
      </svg>
    );
    ```

2.  **Integrate the Icon in `TreeMarker.tsx`:**
    - Open `components/TreeMarker.tsx`.
    - **Import the new icon:**
      ```tsx
      import { /*...,*/ LindenIcon } from './icons';
      ```
    - **Create an ID array for the new tree:**
      ```tsx
      const LINDEN_TREE_IDS = [45];
      // ... existing ID arrays
      ```
    - **Add a boolean check in the `TreeMarker` component:**
      ```tsx
      const isLindenTree = LINDEN_TREE_IDS.includes(tree.id);
      // ... existing boolean checks
      ```
    - **Add the rendering logic at the end of the `TreeMarker` component, just before the default marker logic:**
      ```tsx
      // ... other 'if' blocks for custom icons
      if (isLindenTree) {
        return renderCustomIcon(LindenIcon);
      }

      // Default numbered marker logic follows...
      ```

### Customizing Tree Icon Sizes

You can define specific sizes for custom icons to improve visual balance on the map. This is useful when some icons are more detailed or visually heavier than others.

All size configurations are located at the top of `components/TreeMarker.tsx`.

#### Step 1: Define a New Size Configuration

1.  Open `components/TreeMarker.tsx`.
2.  Near the top of the file, create a new constant that defines the Tailwind CSS classes for each tree size (`XS` to `XL`).

**Example:** Creating custom dimensions for the Oak icon.

```typescript
// In components/TreeMarker.tsx

// A new size configuration for Oak trees.
const oakIconSizeDimensions: Record<TreeSize, string> = {
  [TreeSize.XS]: 'w-2 h-2',
  [TreeSize.S]: 'w-2.5 h-2.5',
  [TreeSize.M]: 'w-3 h-3',
  [TreeSize.L]: 'w-3.5 h-3.5',
  [TreeSize.XL]: 'w-4 h-4',
};
```

#### Step 2: Apply the New Size Configuration

1.  In the same file (`components/TreeMarker.tsx`), find the `renderCustomIcon` function.
2.  Inside this function, there is a logic block that determines which size to use, starting with `let dimensions: string;`.
3.  Add an `else if` condition to check for your tree type and assign your new size configuration. Make sure you've already defined the corresponding boolean check (e.g., `isOakTree`).

**Example:** Applying `oakIconSizeDimensions` to Oak trees.

```typescript
// In the renderCustomIcon function within TreeMarker.tsx

const renderCustomIcon = (IconComponent: React.ElementType) => {
    // ... other code ...

    // Determine icon dimensions based on tree type for visual balance
    let dimensions: string;
    if (isCameliaTree) {
      dimensions = cameliaIconSizeDimensions[tree.size];
    } else if (isMagnoliaTree) {
      dimensions = magnoliaIconSizeDimensions[tree.size];
    } else if (isWalnutTree) {
      dimensions = walnutIconSizeDimensions[tree.size];
    } else if (isOakTree) { // Add this condition
      dimensions = oakIconSizeDimensions[tree.size];
    } else {
      dimensions = customIconSizeDimensions[tree.size]; // Default
    }

    // ... rest of the function ...
};
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