type Product = {
  id: number;
  product_name: string;
  released_at: string;
  image_url: string;
  hp_url: string;
  average_price: number;
  tags?: Tag[];
  updated_at: string;
}

type ProductWithCheck = Product & {
  checked?: boolean;
}

type ProductTag = {
	id?: number
	product_id: number
	tag_id: number
}

type Tag = {
	id: number;
	tag_name: string;
	products?: Product[];
}

type TagOption = {
  value: number;
  label: string;
}