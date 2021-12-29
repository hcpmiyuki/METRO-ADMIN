import { FC } from 'react'
import ProductItem from './product'

type Props = {
  products: Product[];
};

const ProductList: FC<Props> = ({ products }) => {
  return (
    <div>
      <ul>
        {products.map(product => {
          return <li key={product.id}><ProductItem product={product}/></li>
        })}
      </ul>
    </div>
  )
}

export default ProductList;