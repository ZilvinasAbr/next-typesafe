# next-typesafe

Next.js library to bring full type-safety to Next.js

## Installation

```bash
npm install next-typesafe zod
# or
pnpm add next-typesafe zod
# or
yarn add next-typesafe zod
```

## Usage

### Basic Usage

```typescript
import { createPage } from 'next-typesafe';
import { z } from 'zod';

// Create a page with search params validation
const searchParamsSchema = z.object({
  query: z.string().optional(),
  page: z.string().optional(),
});

export default createPage()
  .searchParams(searchParamsSchema)
  .page(async ({ searchParams }) => {
    const { query, page } = await searchParams;

    return (
      <div>
        <h1>Search Results</h1>
        <p>Query: {query}</p>
        <p>Page: {page}</p>
      </div>
    );
  });
```

### With Route Parameters

```typescript
import { createPage } from 'next-typesafe';
import { z } from 'zod';

const paramsSchema = z.object({
  id: z.string(),
});

const searchParamsSchema = z.object({
  tab: z.string().optional(),
});

export default createPage()
  .params(paramsSchema)
  .searchParams(searchParamsSchema)
  .page(async ({ params, searchParams }) => {
    const { id } = await params;
    const { tab } = await searchParams;

    return (
      <div>
        <h1>Post {id}</h1>
        <p>Current tab: {tab || 'default'}</p>
      </div>
    );
  });
```

### Without Validation (Simple Page)

```typescript
import { createPage } from 'next-typesafe';

export default createPage()
  .page(async () => {
    return <div>Simple page with no params</div>;
  });
```

## API

### `createPage()`

Creates a new page builder instance.

### `.searchParams(schema)`

Adds search params validation using a Zod schema. The schema must be a `ZodObject` with string, string array, or optional versions of these types.

### `.params(schema)`

Adds route params validation using a Zod schema. The schema must be a `ZodObject` with string properties only.

### `.page(pageFunction)`

Defines the page component. The function signature depends on what validation schemas were added:

- No schemas: `() => Promise<ReactNode>`
- With schemas: `(options) => Promise<ReactNode>` where `options` contains the validated params and/or searchParams

## Requirements

TBD

## License

MIT
