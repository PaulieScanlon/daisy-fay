# 🌼 Daisy Fay

A [React](https://react.dev/) application with server-side rendering and server-side data fetching. Powered by [Vite](https://vitejs.dev/) and deployed using [Netlify Functions](https://docs.netlify.com/integrations/frameworks/express/).

- 🚀 [https://daisy-fay.netlify.app/](https://daisy-fay.netlify.app/)

## Getting Started

- New pages are added to `src/pages/`
- Pages are named `page.jsx`
- Functions are named `function.js` (Optional)

### Pages

Pages must use `export default`. Function data is available via the `data` prop.

```javascript
const Page = ({ data }) => {
  return (
    <main>
      <h1>Index</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
};

export default Page;
```

### Functions

Functions must export `getServerData` async function.

```javascript
export const getServerData = async () => {
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
