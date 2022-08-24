import React from 'react';
import { useFilterContext } from '../context/filter_context';
import GridView from './GridView';
import ListView from './ListView';

const ProductList = () => {
  const { filtered_products, grid_view } = useFilterContext();
  if (filtered_products.length === 0) {
    return <p>No products match search criteria</p>;
  }
  if (grid_view) {
    return <GridView products={filtered_products} />;
  }
  return <ListView products={filtered_products} />;
};

export default ProductList;
