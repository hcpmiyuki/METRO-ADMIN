import { FC } from 'react'
import Slider from "react-slick";

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
      <div className='w-4/5 text-gray-500'>
        <Slider {...settings}>
          {products.map((product)=>
            <div key={product.id}>
              <img src={product.image_url} alt="pictuer" className="w-full" />
            </div>)
          }
        </Slider>
      </div>
    </div>
  );
}

export default SliderItem;