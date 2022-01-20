import { supabase } from '../utils/supabaseClient'

type Key = "updated_at" | "product_name";

export async function getAllProducts(): Promise<Product[]> {
	const { data, error, status } = await supabase
		.from<Product>('products')
		.select(`
			*,
			tags (
				id,
				tag_name
			)
		`);
	
	if (error && status !== 406) {
		throw error
	}

  if (data === null) {
    return []
  }
  
  return data;
}