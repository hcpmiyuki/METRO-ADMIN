import { FC } from 'react'
import ProductItem from './product'

type Props = {
  products: ProductWithCheck[];
  hadleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const ProductList: FC<Props> = ({ products, hadleCheckboxChange }) => {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4 pt-4">
      {products.map(product => {
        return <ProductItem product={product} key={product.id} hadleCheckboxChange={hadleCheckboxChange}　/>
      })}
    </div>
  )
}

export default ProductList;