import { createClient } from '@supabase/supabase-js';
import _ from 'lodash';
import { BookConfig, defaultBookConfig } from './state/book.config';

const BOOK_CONFIG_TABLE = 'epub-book-config';
const supabase = createClient('https://zepxgzybtlkrokmlavpy.supabase.co', import.meta.env.VITE_SUPABASE_KEY ?? process.env.VITE_SUPABASE_KEY);

export const getBookConfig = async () => {
  const { data } = await supabase.from(BOOK_CONFIG_TABLE).select().eq('id', 1);
  if (!data?.length) return defaultBookConfig;
  return data[0].config as BookConfig;
};

export const updateBookConfig = async (config: BookConfig) => {
  if (_.isEqual(config, defaultBookConfig)) return;
  await supabase.from(BOOK_CONFIG_TABLE).upsert({ config, id: 1 });
};