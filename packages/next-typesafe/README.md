# next-typesafe

> ⚠️ **Early Beta Warning**: This package is in early beta. APIs may change frequently and breaking changes may occur in minor versions. Use with caution in production environments.

**Bring full type-safety to Next.js App Router pages with runtime validation and automatic route type inference.**

`next-typesafe` provides a type-safe wrapper for Next.js pages that validates route parameters and search parameters at runtime using Zod schemas, while leveraging Next.js's built-in route type generation for complete type safety.

## ✨ Features

- 🎯 **Full Type Safety** - Get complete TypeScript support for route and search parameters
- 🔍 **Runtime Validation** - Validate parameters using Zod schemas with detailed error handling
- 🚀 **Zero Config** - Works out of the box with Next.js App Router and generated types
- 🔄 **Promise-based** - Compatible with Next.js 15+ async components
- 📝 **IntelliSense** - Full autocomplete and type checking in your IDE
- 🛡️ **Route Constraint** - Only allows valid routes defined in your Next.js app

## 🚀 Quick Start

### Installation

```bash
npm install next-typesafe zod
```

### 1. Set up Route Type Constraints

Create a `next-typesafe.d.ts` file in your project root to enable route type constraints:

```typescript
// next-typesafe.d.ts
import type { AppRoutes } from "./.next/types/routes";

declare global {
  namespace NextTypesafe {
    interface Register {
      routes: AppRoutes;
    }
  }
}

export {};
```

### 2. Use in Your Pages

Use `createPage` with your route path - TypeScript will only allow valid routes:

```typescript
// app/search/page.tsx
import { createPage } from 'next-typesafe';
import { z } from 'zod';

const searchParamsSchema = z.object({
  q: z.string().min(1),
  page: z.string().optional(),
  category: z.array(z.string()).optional(),
});

export default createPage("/search") // TypeScript enforces valid routes!
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

export default createPage("/about")
  .page(async () => {
    return <div>About Us</div>;
  });
```

### Dynamic Routes with Parameters

```typescript
// app/posts/[slug]/page.tsx
import { createPage } from 'next-typesafe';
import { z } from 'zod';

const paramsSchema = z.object({
  slug: z.string(),
});

export default createPage("/posts/[slug]") // Route path automatically typed!
  .params(paramsSchema)
  .page(async ({ params }) => {
    const { slug } = await params; // TypeScript knows slug: string

    return <h1>Post: {slug}</h1>;
  });
```

### Complex Example with Both Parameters

```typescript
// app/users/[id]/posts/page.tsx
import { createPage } from 'next-typesafe';
import { z } from 'zod';

const paramsSchema = z.object({
  id: z.string().regex(/^\d+$/, "Must be numeric"),
});

const searchParamsSchema = z.object({
  status: z.enum(['published', 'draft', 'archived']).optional(),
  sort: z.enum(['date', 'title', 'views']).default('date'),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});

export default createPage("/users/[id]/posts") // Fully type-safe route!
  .params(paramsSchema)
  .searchParams(searchParamsSchema)
  .page(async ({ params, searchParams }) => {
    const { id } = await params; // TypeScript knows: string
    const { status, sort, limit } = await searchParams; // All fully typed!

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
  email: z.string().email('Invalid email format'),

  // Optional with default value
  theme: z.enum(['light', 'dark']).default('light'),

  // String array (e.g., ?tags=react&tags=nextjs)
  tags: z.array(z.string()).optional(),

  // Transform string to number
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),

  // Date validation
  from: z.string().datetime().optional(),

  // Custom validation
  priority: z
    .string()
    .refine((val) => ['low', 'medium', 'high'].includes(val), {
      message: 'Priority must be low, medium, or high',
    })
    .optional(),
});
```

## 🛡️ Route Type Safety

`next-typesafe` leverages Next.js's built-in type generation to ensure you can only use routes that exist in your app.

### How it works

1. **Next.js generates route types** automatically in `.next/types/routes.d.ts`
2. **You augment the library** with these types using module declaration
3. **TypeScript enforces** only valid routes can be passed to `createPage`

```typescript
// ✅ Valid route - TypeScript allows this
createPage("/users/[id]/posts")

// ❌ Invalid route - TypeScript error!
createPage("/non-existent-route")
// Error: Argument of type '"/non-existent-route"' is not assignable to parameter of type 'AppRoutes'
```

### Setup

Create `next-typesafe.d.ts` in your project root:

```typescript
import type { AppRoutes } from "./.next/types/routes";

declare global {
  namespace NextTypesafe {
    interface Register {
      routes: AppRoutes;
    }
  }
}

export {};
```

## 🔧 API Reference

### `createPage(path)`

Creates a type-safe page builder for the specified route path.

```typescript
const pageBuilder = createPage("/users/[id]/posts");
```

**Parameters:**
- `path` - The route path (must be a valid route in your Next.js app when type augmentation is set up)

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

- Must be a `z.object()` with string-compatible properties
- Should match the route's dynamic segments
- TypeScript will infer parameter types from the route path

### `.page(component)`

Defines the page component.

**Function signatures:**

- No validation: `() => Promise<ReactNode>`
- With validation: `({ params, searchParams }) => Promise<ReactNode>`

## 🎯 Type Safety Features

### Route Validation

```typescript
// ✅ This works - valid route in your app
createPage("/users/[id]/posts")

// ❌ This fails - route doesn't exist
createPage("/invalid/route")
// TypeScript Error: Argument of type '"/invalid/route"' is not assignable to parameter of type 'AppRoutes'
```

### Parameter Type Inference

```typescript
// TypeScript automatically knows the parameter types from the route
export default createPage("/users/[id]/posts/[slug]")
  .params(z.object({
    id: z.string(),    // TypeScript expects this parameter
    slug: z.string(),  // TypeScript expects this parameter
  }))
  .page(async ({ params }) => {
    const { id, slug } = await params; // Both typed as string
    // Full TypeScript autocomplete and validation!
  });
```

### Search Parameters Type Safety

```typescript
export default createPage("/search")
  .searchParams(z.object({
    q: z.string(),
    tags: z.array(z.string()).optional(),
    page: z.string().transform(Number).default(1),
  }))
  .page(async ({ searchParams }) => {
    const { q, tags, page } = await searchParams;
    // q: string
    // tags: string[] | undefined  
    // page: number
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
