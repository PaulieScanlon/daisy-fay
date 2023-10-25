# Daisy Fay

A React SSR Framework powered by Vite

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

Site available to view on `http://localhost:4173`

## Production

```
npm run build
```

### Production Preview

```
npm run preview
```

Site available to view on `http://localhost:5173`
