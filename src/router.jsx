import { Route, Routes } from 'react-router-dom';

const pages = import.meta.glob('./pages/*/page.jsx', { eager: true });

const routes = Object.keys(pages).map((path) => {
  const dir = path.split('/')[2];
  return {
    path: dir === 'index' ? '/' : dir,
    element: pages[path].default,
  };
});

export const Router = ({ data }) => {
  if (typeof window !== 'undefined') {
    data = window.__data__;
  }

  return (
    <Routes>
      {routes.map((route, index) => {
        const { path, element: Component } = route;
        return <Route key={index} path={path} element={<Component data={{ data }} />} />;
      })}
    </Routes>
  );
};
