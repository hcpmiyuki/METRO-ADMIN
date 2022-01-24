import { FC } from 'react'
// import Image from 'next/image'
import TagItem from '../tag/tag'
import CheckInput from '../../ui/CheckInput'

type Props = {
  product: ProductWithCheck;
	hadleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const ProductItem: FC<Props> = ({ product, hadleCheckboxChange }) => {
	return (
		<div>
			<div className='relative w-full h-52'>
				{/* next/image使いたい */}
				{/* <Image src={product.image_url} layout="fill" objectFit="contain" alt={product.product_name} /> */}
				<img src={product.image_url} alt="pictuer" className='w-full'/>
			</div>
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