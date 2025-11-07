import { useEffect, useState } from 'react';
import { graphqlClient } from '@/lib/graphql-client';
import { GET_SITE_CONTENT, SiteContent } from '@/lib/content-queries';

const defaultContent: SiteContent = {
  supportEmail: 'soporte@kaostore.com',
  contactEmail: 'contacto@kaostore.com',
  aboutUs: undefined,
  shippingPolicy: undefined,
  returnPolicy: undefined,
  faqContent: undefined,
  legalContent: undefined,
  privacyPolicy: undefined,
  termsOfService: undefined,
  socialMedia: {
    facebook: undefined,
    instagram: undefined,
    twitter: undefined,
  },
};

export function useContent() {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const result = await graphqlClient.query(GET_SITE_CONTENT, {});

        if (result.data?.siteContent) {
          setContent(result.data.siteContent);
        } else {
          setContent(defaultContent);
        }
      } catch (err) {
        console.error('Error fetching site content:', err);
        setError('Failed to load site content');
        setContent(defaultContent);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return { content, loading, error };
}
