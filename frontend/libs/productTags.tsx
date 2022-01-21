import { supabase } from '../utils/supabaseClient'

export async function insertProductTags(products:Product[], tagOptions:readonly TagOption[]) {
  const relations = createProductTagRelationsArray(products, tagOptions);
  const { data, error, status } = await supabase
  .from<ProductTag>('product_tags')
  .upsert(
    relations,
    {onConflict: 'product_id, tag_id'}
  );

	if (error && status !== 406) throw error;
  if (!data) return [];
  
  return data;
}

export async function deleteProductTags(products:Product[], tagId: number) {
  const productIds = products.map(product => product.id);
  const { data, error, status } = await supabase
  .from<ProductTag>('product_tags')
  .delete()
  .match({tag_id: tagId})
  .in('product_id', productIds);

	if (error && status !== 406) throw error;
  if (!data) return [];
  
  return data;
}

export function createProductTagRelationsArray(products:Product[], tagOptions:readonly TagOption[]) {
  let relations:ProductTag[] = [];
  products.forEach(product => {
    tagOptions.forEach(tag => {
      relations.push({
        product_id: product.id,
        tag_id: tag.value
      })
    });
  });

  return relations;
}
