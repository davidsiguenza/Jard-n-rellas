<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1hXLYMNRM1Kq-neUCg96QWIPpSAtbMn8E


## Deployment en GitHub Pages


**Pasos para desplegar el proyecto en GitHub Pages:**

1. Asegúrate de que los archivos de datos históricos estén en la carpeta `public/data`.
2. Ejecuta el build del proyecto:
   `npm run build`
3. Despliega el contenido en GitHub Pages:
   `npm run deploy`
4. Espera unos minutos y verifica la URL pública: `https://<usuario>.github.io/Jard-n-rellas/`

**Configuración de GitHub Pages:**
- Ve a la configuración del repositorio en GitHub (`Settings > Pages`).
- En la sección "Build and deployment", selecciona:
  - **Source:** Deploy from a branch
  - **Branch:** `gh-pages`
  - **Folder:** `/ (root)`
- Guarda los cambios. GitHub Pages publicará el contenido de la rama `gh-pages` generado por el comando `npm run deploy`.

**Notas:**
- El comando `npm run deploy` utiliza el paquete `gh-pages` para publicar el contenido de la carpeta `dist` en la rama `gh-pages`.
- Si no ves los cambios reflejados, recarga la página con Ctrl+F5 y verifica que el archivo `manifest.json` esté actualizado en la URL pública.

## Crear un nuevo archivo de historial de datos

**Pasos para agregar un nuevo histórico:**

1. Crea el nuevo archivo JSON en la carpeta `public/data` siguiendo el formato:
   ```json
   {
     "date": "YYYY-MM-DD",
     "trees": [ ... ]
   }
   ```
2. Actualiza el archivo `public/data/manifest.json` para incluir la nueva versión:
   ```json
   {
     "versions": [
       { "date": "YYYY-MM-DD", "path": "/data/YYYY-MM-DD.json" },
       ...
     ]
   }
   ```
3. Haz commit y push de los cambios:
   ```sh
   git add public/data/*
   git commit -m "add new historical data YYYY-MM-DD"
   git push origin main
   ```
4. Ejecuta el build y despliegue:
   ```sh
   npm run build
   npm run deploy
   ```
5. Verifica que el nuevo histórico aparece en el desplegable de la web.
