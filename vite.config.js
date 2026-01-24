import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import sharp from 'sharp'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    {
      name: 'sharp-image-optimizer',
      async generateBundle(_, bundle) {
        const images = Object.keys(bundle).filter(key => 
          /\.(png|jpg|jpeg|webp)$/i.test(key)
        );

        for (const file of images) {
          try {
            const chunk = bundle[file];
            if (chunk.type === 'asset') {
              const buffer = Buffer.from(chunk.source);
              
              // Resize to max 1200px width (safest for web) and optimize
              const data = await sharp(buffer)
                .resize({ width: 1200, withoutEnlargement: true }) 
                .toBuffer();
              
              chunk.source = data;
              console.log(`Optimized ${file}`);
            }
          } catch (error) {
            console.error(`Failed to optimize ${file}:`, error);
          }
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
