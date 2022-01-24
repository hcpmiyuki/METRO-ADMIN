import { FC } from 'react'
import Slider from "react-slick";
// import Image from 'next/image'

type Props = {
  products: Product[];
}
const SliderItem: FC<Props> = ({ products }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
  };

  return (
    <div className="flex justify-center">
      <div className='w-4/5'>
        <Slider {...settings}>
          {products.map((product)=>
            <div key={product.id} className='relative w-full h-52'>
              {/* next/image使いたい */}
              {/* <Image src={product.image_url} alt="pictuer" layout="fill" objectFit="contain"  /> */}
              <img src={product.image_url} alt="pictuer" className='w-full'/>
            </div>)
          }
        </Slider>
      </div>
    </div>
  );
}

export default SliderItem;