import { createPage } from 'next-typesafe';
import * as z from 'zod/v4';

export default createPage('/category/[type]')
  .params(
    z.object({
      type: z.enum(['tech', 'design', 'business', 'marketing']),
    }),
  )
  .page(async ({ params }) => {
    const { type } = await params;

    // TypeScript knows `type` is exactly: 'tech' | 'design' | 'business' | 'marketing'
    const categoryInfo = {
      tech: { title: 'Technology', icon: '💻', color: 'blue' },
      design: { title: 'Design', icon: '🎨', color: 'purple' },
      business: { title: 'Business', icon: '💼', color: 'green' },
      marketing: { title: 'Marketing', icon: '📱', color: 'orange' },
    }[type];

    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem' }}>{categoryInfo.icon}</div>
        <h1 style={{ color: categoryInfo.color }}>
          {categoryInfo.title} Category
        </h1>
        <p>
          You selected the <strong>{type}</strong> category.
        </p>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          This demonstrates z.enum() validation working with Next.js route
          parameters. Try visiting: /category/tech, /category/design,
          /category/business, or /category/marketing
        </p>
        <div style={{ marginTop: '2rem' }}>
          <a href="/category/tech" style={{ margin: '0 1rem', color: 'blue' }}>
            Tech
          </a>
          <a
            href="/category/design"
            style={{ margin: '0 1rem', color: 'purple' }}
          >
            Design
          </a>
          <a
            href="/category/business"
            style={{ margin: '0 1rem', color: 'green' }}
          >
            Business
          </a>
          <a
            href="/category/marketing"
            style={{ margin: '0 1rem', color: 'orange' }}
          >
            Marketing
          </a>
        </div>
      </div>
    );
  });
