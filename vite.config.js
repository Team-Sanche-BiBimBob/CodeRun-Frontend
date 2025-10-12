import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 환경변수에서 API 주소 가져오기, 없으면 기본값 사용
const baseURL = process.env.VITE_API_BASE_URL || 'https://api.coderun.site/';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      "/api":{
        target: baseURL,
        changeOrigin:true,
        rewrite:(path)=>path
      }
    }
  },
  build: {
    // 청크 크기 최적화
    rollupOptions: {
      output: {
        manualChunks: {
          // 벤더 라이브러리들을 별도 청크로 분리
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-ui': ['lucide-react', 'react-icons'],
          'vendor-monaco': ['@monaco-editor/react']
        }
      }
    },
    // 청크 크기 경고 임계값 증가
    chunkSizeWarningLimit: 1000,
    // 소스맵 비활성화로 빌드 크기 감소
    sourcemap: false,
    // CSS 코드 분할 활성화
    cssCodeSplit: true,
    // 압축 최적화
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 프로덕션에서 console.log 제거
        drop_debugger: true
      }
    }
  },
  // 이미지 최적화를 위한 assetsInlineLimit 설정
  assetsInlineLimit: 4096 // 4kb 이하는 인라인으로 처리
})
