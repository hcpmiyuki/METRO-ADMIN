import { FC } from 'react'
import Image from 'next/image'
import TagItem from './tag'

type Props = {
  product: ProductWithCheck;
	hadleCheckboxChange: (event: any) => void;
};

const ProductItem: FC<Props> = ({ product, hadleCheckboxChange }) => {
	return (
		<div>
			<Image src={product.image_url} width={64} height={64} alt={product.product_name} />
			<div className='block'>
				<input type="checkbox" value={product.id} checked={product.isChecked} className="rounded" onChange={hadleCheckboxChange}/>
				<a>{product.product_name}</a>
			</div>
			<div className='space-x-1'>
				{product.tags.map((tag) => {
					return <TagItem key={tag.id} tagName={tag.tag_name}/>
				})}
			</div>
		</div>
	)
}

export default ProductItem;