// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
        svgoConfig: {
          floatPrecision: 2,
          plugins: [
            {
              // To support SVG's that use hardcoded ids alongside inline styles
              name: 'convertStyleToAttrs',
            },
            {
              // To support SVG's that use hardcoded ids alongside inline styles
              name: 'prefixIds',
              params: {
                prefixIds: true,
              },
            },
          ],
        },
      },
      include: '**/*.svg?react',
    }),
  ],
});
