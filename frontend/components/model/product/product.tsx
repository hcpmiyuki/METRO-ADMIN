import { FC } from 'react'
import Image from 'next/image'
import TagItem from '../tag/tag'
import CheckInput from '../../ui/CheckInput'

type Props = {
  product: ProductWithCheck;
	hadleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const ProductItem: FC<Props> = ({ product, hadleCheckboxChange }) => {
	return (
		<div>
			<Image src={product.image_url} width={64} height={64} alt={product.product_name} />
			<div className='block'>
				{(typeof product.checked !== "undefined") &&
					<CheckInput
						handleChange={hadleCheckboxChange}
						value={product.id}
						checked={product.checked}
						customStyles="rounded"
					/>
				}
				<a>{product.product_name}</a>
			</div>
			<div className='space-x-1'>
				{product.tags && product.tags.map((tag) => {
					return <TagItem key={tag.id} tagName={tag.tag_name}/>
				})}
			</div>
		</div>
	)
}

export default ProductItem;