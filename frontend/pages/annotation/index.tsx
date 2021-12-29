import { FC, useEffect, useState } from "react"
import { getProducts } from '../../libs/product'
import ProductList from '../../components/productList'

const ProductPage: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsSearched, setProductsSearched] = useState<Product[]>([]);
  const [searchWord, setSearchWord] = useState<string>('');

  useEffect( () => {
    getProducts().then((products) => {
      setProducts(products);
      setProductsSearched(products);
    });
  }, [])

  const handleChange = (event: any) => {
    setSearchWord(event.target.value);
  }

  const handleSubmit = (event: any) => {
    const produtsSearched = products.filter(product => product.product_name.includes(searchWord));
    setProductsSearched(produtsSearched);
    event.preventDefault();
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type='text' value={searchWord} onChange={handleChange}/>
        <input type="submit" value="Submit" />
      </form>
      <ProductList products={productsSearched} />
    </div>
  );
};

export default ProductPage;