# CodeRun Frontend

타이핑 연습 웹 애플리케이션입니다.

## 환경 설정

### 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# API 서버 주소
VITE_API_BASE_URL=https://api.coderun.site
```

### 개발 서버 실행

```bash
npm install
npm run dev
```

## 기술 스택

- React + Vite
- Monaco Editor
- Tailwind CSS

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
