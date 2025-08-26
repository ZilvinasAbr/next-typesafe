import { createPage } from 'next-typesafe';
import { z } from 'zod';

export default createPage('/enum-searchparams')
  .searchParams(
    z.object({
      theme: z.enum(['light', 'dark']).optional().default('light'),
      defaultRequired: z.enum(['light', 'dark']).default('light'),
      optional: z.enum(['light', 'dark']).optional(),
    }),
  )
  .page(async ({ searchParams }) => {
    const { theme } = await searchParams;
    return (
      <div>
        <h1>Enum Search Params</h1>
        <p>Theme: {theme}</p>
      </div>
    );
  });
