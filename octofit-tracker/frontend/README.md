# React + Vite

This frontend uses Vite environment variables to target the public backend URL in GitHub Codespaces.

## Required environment variable

Create a local environment file at .env.local and define VITE_CODESPACE_NAME before running the app:

```bash
VITE_CODESPACE_NAME=your-codespace-name
```

If VITE_CODESPACE_NAME is not set, the app falls back to http://127.0.0.1:8000/api/ for local development.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
