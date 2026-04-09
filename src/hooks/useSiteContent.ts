import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface SiteContent {
  key: string;
  value: string;
  type: string;
  label: string;
  section: string;
}

export function useSiteContent() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [items, setItems] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*');

      if (error) throw error;

      if (data) {
        const contentMap: Record<string, string> = {};
        data.forEach((item: SiteContent) => {
          contentMap[item.key] = item.value;
        });
        setContent(contentMap);
        setItems(data);
      }
    } catch (error) {
      console.error('Error fetching site content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const getContent = (key: string, defaultValue: string = '') => {
    return content[key] || defaultValue;
  };

  return { content, items, loading, getContent, refresh: fetchContent };
}
