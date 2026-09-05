## 图片压缩

#### vite

```javascript
import viteImagemin from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    viteImagemin({
      gifsicle: { quality: 80 }, // gif压缩
      optipng: { optimizationLevel: 2 }, // png压缩
      mozjpeg: { quality: 80 }, // jpg压缩
      pngquant: { quality: [0.6, 0.8] }
    })
  ]
})
```