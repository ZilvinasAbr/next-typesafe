# next-typesafe

**Bring full type-safety to Next.js App Router pages with automatic type generation and runtime validation.**

`next-typesafe` provides a type-safe wrapper for Next.js pages that validates route parameters and search parameters at runtime using Zod schemas, while automatically generating TypeScript interfaces for your routes.

## ✨ Features

- 🎯 **Full Type Safety** - Get complete TypeScript support for route and search parameters
- 🔍 **Runtime Validation** - Validate parameters using Zod schemas with detailed error handling
- 🤖 **Automatic Type Generation** - CLI tool generates TypeScript interfaces for all your routes
- 🚀 **Zero Config** - Works out of the box with Next.js App Router
- 🔄 **Promise-based** - Compatible with Next.js 15+ async components
- 📝 **IntelliSense** - Full autocomplete and type checking in your IDE

## 🚀 Quick Start

### Installation

```bash
npm install next-typesafe zod
```

### 1. Generate Page Types

Add a script to your `package.json`:

```json
{
  "scripts": {
    "typesafe": "next-typesafe generate-types"
  }
}
```

Run the type generation:

```bash
npm run typesafe
```

This will scan your `app/` directory and generate `_page-type.ts` files next to each `page.tsx`.

### 2. Use in Your Pages

Import the generated `PageType` and use it with `createPage`:

```typescript
// app/search/page.tsx
import { createPage } from 'next-typesafe';
import { z } from 'zod';
import type { PageType } from './_page-type';

const searchParamsSchema = z.object({
  q: z.string().min(1),
  page: z.string().optional(),
  category: z.array(z.string()).optional(),
});

export default createPage<PageType>()
  .searchParams(searchParamsSchema)
  .page(async ({ searchParams }) => {
    const { q, page, category } = await searchParams;

    return (
      <div>
        <h1>Search Results for "{q}"</h1>
        {page && <p>Page: {page}</p>}
        {category && <p>Categories: {category.join(', ')}</p>}
      </div>
    );
  });
```

## 📖 Usage Examples

### Simple Page (No Parameters)

```typescript
// app/about/page.tsx
import { createPage } from 'next-typesafe';
import type { PageType } from './_page-type';

export default createPage<PageType>()
  .page(async () => {
    return <div>About Us</div>;
  });
```

### Dynamic Routes with Parameters

```typescript
// app/posts/[slug]/page.tsx
import { createPage } from 'next-typesafe';
import { z } from 'zod';
import type { PageType } from './_page-type';

const paramsSchema = z.object({
  slug: z.string(),
});

export default createPage<PageType>()
  .params(paramsSchema)
  .page(async ({ params }) => {
    const { slug } = await params;

    return <h1>Post: {slug}</h1>;
  });
```

### Complex Example with Both Parameters

```typescript
// app/users/[id]/posts/page.tsx
import { createPage } from 'next-typesafe';
import { z } from 'zod';
import type { PageType } from './_page-type';

const paramsSchema = z.object({
  id: z.string().regex(/^\d+$/, "Must be numeric"),
});

const searchParamsSchema = z.object({
  status: z.enum(['published', 'draft', 'archived']).optional(),
  sort: z.enum(['date', 'title', 'views']).default('date'),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});

export default createPage<PageType>()
  .params(paramsSchema)
  .searchParams(searchParamsSchema)
  .page(async ({ params, searchParams }) => {
    const { id } = await params;
    const { status, sort, limit } = await searchParams;

    return (
      <div>
        <h1>Posts by User {id}</h1>
        <p>Status filter: {status || 'all'}</p>
        <p>Sort by: {sort}</p>
        {limit && <p>Limit: {limit}</p>}
      </div>
    );
  });
```

### Advanced Zod Validation

```typescript
const searchParamsSchema = z.object({
  // Required string with validation
  email: z.string().email("Invalid email format"),

  // Optional with default value
  theme: z.enum(["light", "dark"]).default("light"),

  // String array (e.g., ?tags=react&tags=nextjs)
  tags: z.array(z.string()).optional(),

  // Transform string to number
  page: z.string().regex(/^\d+$/).transform(Number).default("1"),

  // Date validation
  from: z.string().datetime().optional(),

  // Custom validation
  priority: z
    .string()
    .refine((val) => ["low", "medium", "high"].includes(val), {
      message: "Priority must be low, medium, or high",
    })
    .optional(),
});
```

## 🛠️ CLI Tool

The `next-typesafe` CLI automatically generates TypeScript interfaces for your routes:

```bash
npx next-typesafe generate-types
```

### Generated Types

For a route like `app/users/[id]/posts/[slug]/page.tsx`, it generates:

```typescript
// app/users/[id]/posts/[slug]/_page-type.ts
export interface PageParams {
  id: string;
  slug: string;
}

export interface PageType {
  params: PageParams;
}
```

For routes without parameters:

```typescript
// app/about/_page-type.ts
export interface PageType {
  // No dynamic params for this route
}
```

## 🔧 API Reference

### `createPage<PageType>()`

Creates a type-safe page builder. **Requires** a `PageType` generic parameter.

```typescript
import type { PageType } from "./_page-type";

const pageBuilder = createPage<PageType>();
```

### `.searchParams(schema)`

Adds search parameter validation with a Zod schema.

**Supported Zod types:**

- `z.string()` / `z.string().optional()`
- `z.array(z.string())` / `z.array(z.string()).optional()`
- `z.enum()`, `z.boolean()`, `z.number()` (as strings)
- Transformations with `.transform()`
- Default values with `.default()`

### `.params(schema)`

Adds route parameter validation with a Zod schema.

**Requirements:**

- Must be a `z.object()` with string properties only
- Must match the route's dynamic segments
- TypeScript will enforce schema matches the generated `PageType`

### `.page(component)`

Defines the page component.

**Function signatures:**

- No validation: `() => Promise<ReactNode>`
- With validation: `({ params, searchParams }) => Promise<ReactNode>`

## 🎯 Type Safety Features

### Compile-time Validation

```typescript
// ✅ This works - schema matches PageType
const paramsSchema = z.object({
  id: z.string(),
  slug: z.string(),
});

// ❌ This fails - missing 'slug' parameter
const badSchema = z.object({
  id: z.string(),
  // slug is missing!
});
```

### Required Generics

```typescript
// ❌ This fails - PageType generic is required
createPage().page(() => <div>Hello</div>);

// ✅ This works - PageType provided
createPage<PageType>().page(() => <div>Hello</div>);
```

### Parameter Type Safety

```typescript
export default createPage<PageType>()
  .params(paramsSchema)
  .searchParams(searchParamsSchema)
  .page(async ({ params, searchParams }) => {
    // params and searchParams are fully typed!
    const { id } = await params; // string
    const { tags } = await searchParams; // string[] | undefined

    // TypeScript autocomplete and validation works!
  });
```

## 📋 Requirements

- **Next.js** 15.0.0+ (App Router) and supports only async `params` and `searchParams`
- **Zod** v3 or v4 should work. In future other libraries will be supported.

## Future roadmap

- Type-safe navigation with `params` and `searchParams`.
- Middleware support for `createPage`: ability to run code before rendering the page component.
- Support for other validation libraries (e.g. Valibot, Arktype).
- Support for older Next.js versions.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © [Žilvinas Abromavičius](https://github.com/ZilvinasAbr)
