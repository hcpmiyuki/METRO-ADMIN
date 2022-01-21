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
	
		if (error && status !== 406) throw error;
		if (!data) return [];
  
  return data;
	}

export async function getProductById(id: number): Promise<Product> {
	const { data, error, status } = await supabase
	.from<Product>('products')
	.select(`
		*,
		tags (
			id,
			tag_name
		)
	`)
	.eq('id', id)
	.single();

	if (error && status !== 406 || data === null) throw error;
  
  return data;
  }

export async function getProductsByIds(ids: number[]): Promise<Product[]> {
	const { data, error, status } = await supabase
	.from<Product>('products')
	.select(`
		*,
		tags (
			id,
			tag_name
		)
	`)
	.in('id', ids);

	if (error && status !== 406) throw error;
  if (!data) return [];
  
  return data;
}