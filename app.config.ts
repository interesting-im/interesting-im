import { createApp } from 'vinxi'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default createApp({
  server: {
    preset: 'node-server',
  },
  routers: [
    {
      name: 'public',
      type: 'static',
      dir: './public',
    },
    {
      name: 'client',
      type: 'spa',
      handler: './index.html',
      target: 'browser',
      plugins: () => [
        TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
        tailwindcss(),
        react(),
        {
          name: 'resolve-alias',
          config: () => ({
            resolve: {
              alias: {
                '~': path.resolve(__dirname, './src'),
                '@': path.resolve(__dirname, './src'),
              },
            },
          }),
        },
      ],
    },
  ],
})
