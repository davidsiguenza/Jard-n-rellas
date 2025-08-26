import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // MUY IMPORTANTE: Cambia <TU-NOMBRE-DE-REPOSITORIO> por el nombre de tu repositorio en GitHub.
      // Por ejemplo, si tu repositorio está en https://github.com/tu-usuario/mi-jardin,
      // deberías poner: base: '/mi-jardin/',
      base: '/Jard-n-rellas/',
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
