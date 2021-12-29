import { supabase } from '../utils/supabaseClient'

type Key = "updated_at" | "product_name";

export async function getProducts(): Promise<Product[]> {
	const { data, error, status } = await supabase
		.from<Product>('products')
		.select(`
			*,
			tags (
				id,
				tag_name
			)
		`)
    .limit(10)
	
	if (error && status !== 406) {
		throw error
	}
  return data;
}