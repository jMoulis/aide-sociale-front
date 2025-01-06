import { headers } from 'next/headers';
import Link from 'next/link';

export async function getSiteData(domain: string) {
  try {
    // Construct API endpoint based on the domain
    const response = await fetch(
      `https://api.example.com/site-data?domain=${domain}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch site data');
    }

    // Parse and return the JSON data
    const siteData = await response.json();
    return siteData;
  } catch (error) {
    console.error(`Error fetching site data for domain ${domain}:`, error);

    // Return default data if there's an error
    return {
      siteName: 'Default Site Name',
      description: 'Default description'
    };
  }
}
export default async function NotFound() {
  const headersList = await headers();
  const domain = headersList.get('host');
  const data = await getSiteData(domain || '');
  return (
    <div>
      <h2>Not Found: {data.name}</h2>
      <p>Could not find requested resource</p>
      <p>
        View <Link href='/blog'>all posts</Link>
      </p>
    </div>
  );
}
