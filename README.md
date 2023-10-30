# Daisy Fay

A React SSR Framework powered by Vite

- 🚀 [https://daisy-fay.netlify.app/](https://daisy-fay.netlify.app/)

## Getting Started

- New pages are added to `src/pages/`
- Pages are called `page.jsx`
- (Optional) Functions are called `function.js`

### Functions

Functions must export `GET` async function.

```javascript
export const GET = async () => {
  const request = await fetch('https://...');
  const data = await request.json();

  return data;
};
```

## Development

```
npm run dev
```

Site available to view on `http://localhost:5173`

## Production

```
npm run build
```
