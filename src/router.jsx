import { Route, Routes } from 'react-router-dom';

import Index from './pages/index';
import Carts from './pages/carts';

export const Router = ({ data }) => {
  if (typeof window !== 'undefined') {
    data = window.__data__;
  }

  return (
    <Routes>
      <Route path='/' element={<Index data={{ data }} />} />
      <Route path='/carts' element={<Carts data={{ data }} />} />
    </Routes>
  );
};
