import { supabase } from '../utils/supabaseClient'

export async function getTags(): Promise<Tag[]> {
  const { data, error, status } = await supabase
  .from<Tag>('tags')
  .select(`
    id,
    tag_name
  `)

  if (error && status !== 406) {
		throw error
	}

  if (data === null) {
    return []
  }
  
  return data;
}

export async function createTag(tagName: string): Promise<Tag> {
  const { data, error, status } = await supabase
  .from<Tag>('tags')
  .insert({tag_name: tagName});

  if (error && status !== 406 || data === null) {
		throw error
	}

  return data[0];
}