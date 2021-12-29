import { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  product: Product;
};

const ProductItem: FC<Props> = ({ product }) => {
	return (
		<div>
			<Image src={product.image_url} width={64} height={64} alt={product.product_name} />
			<a href={product.hp_url}>{product.product_name}</a>
			<a>{product.released_at}</a>
			<a>平均金額:{product.average_price}円</a>
			{product.tags.map((tag) => {
				return (
					<Link href={`/tags/${tag.id}`} key={tag.id}>
						<a>{tag.tag_name}</a>
					</Link>
				)
			})}
		</div>
	)
}

export default ProductItem;