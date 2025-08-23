/**
 * Test cases for z.enum() support in params()
 * 
 * z.enum() should work since enums are validated against string values,
 * which matches Next.js route parameter constraints.
 */

import { createPage } from "../createPage";
import { z } from "zod";

// Test Case 1: Basic z.enum() support
interface BasicEnumPageType {
  params: {
    category: string;  // Next.js always provides strings
  };
}

const basicEnumTest = createPage<BasicEnumPageType>()
  .params(z.object({
    category: z.enum(['tech', 'design', 'business']),  // Should work - validates string values
  }))
  .page(async ({ params }) => {
    const { category } = await params;
    // category will be one of: 'tech' | 'design' | 'business'
    return `Category: ${category}`;
  });

// Test Case 2: Multiple enum params
interface MultiEnumPageType {
  params: {
    category: string;
    status: string;
    priority: string;
  };
}

const multiEnumTest = createPage<MultiEnumPageType>()
  .params(z.object({
    category: z.enum(['tech', 'design', 'business']),
    status: z.enum(['draft', 'published', 'archived']),
    priority: z.enum(['low', 'medium', 'high']),
  }))
  .page(async ({ params }) => {
    const { category, status, priority } = await params;
    return `Category: ${category}, Status: ${status}, Priority: ${priority}`;
  });

// Test Case 3: Optional enum params
interface OptionalEnumPageType {
  params: {
    type?: string;  // Optional in Next.js (though rare for route params)
  };
}

const optionalEnumTest = createPage<OptionalEnumPageType>()
  .params(z.object({
    type: z.enum(['article', 'video', 'podcast']).optional(),
  }))
  .page(async ({ params }) => {
    const { type } = await params;
    return type ? `Type: ${type}` : 'No type specified';
  });

// Test Case 4: Mixed enum and string params
interface MixedParamsPageType {
  params: {
    id: string;
    category: string;
    slug: string;
  };
}

const mixedParamsTest = createPage<MixedParamsPageType>()
  .params(z.object({
    id: z.string(),
    category: z.enum(['tech', 'design', 'business']),
    slug: z.string(),
  }))
  .page(async ({ params }) => {
    const { id, category, slug } = await params;
    return `ID: ${id}, Category: ${category}, Slug: ${slug}`;
  });

// Test Case 5: Enum with default values
interface DefaultEnumPageType {
  params: {
    sort?: string;
  };
}

const defaultEnumTest = createPage<DefaultEnumPageType>()
  .params(z.object({
    sort: z.enum(['name', 'date', 'popularity']).default('name'),
  }))
  .page(async ({ params }) => {
    const { sort } = await params;
    return `Sorted by: ${sort}`;
  });

// Test Case 6: Numeric string enum (common in URLs)
interface NumericEnumPageType {
  params: {
    version: string;
  };
}

const numericEnumTest = createPage<NumericEnumPageType>()
  .params(z.object({
    version: z.enum(['1', '2', '3']),  // String numbers for URL compatibility
  }))
  .page(async ({ params }) => {
    const { version } = await params;
    return `API Version: ${version}`;
  });

// Test Case 7: Large enum (common with country codes, etc.)
interface LargeEnumPageType {
  params: {
    country: string;
  };
}

const COUNTRIES = ['us', 'uk', 'ca', 'au', 'de', 'fr', 'es', 'it', 'jp', 'kr'] as const;

const largeEnumTest = createPage<LargeEnumPageType>()
  .params(z.object({
    country: z.enum(COUNTRIES),
  }))
  .page(async ({ params }) => {
    const { country } = await params;
    return `Country: ${country.toUpperCase()}`;
  });

console.log("✅ z.enum() test cases created");
console.log("- Basic enum validation");
console.log("- Multiple enums");
console.log("- Optional enums");
console.log("- Mixed param types");
console.log("- Default enum values");
console.log("- Numeric string enums");
console.log("- Large enum sets");

// Prevent unused variable warnings
console.log({
  basicEnumTest,
  multiEnumTest,
  optionalEnumTest,
  mixedParamsTest,
  defaultEnumTest,
  numericEnumTest,
  largeEnumTest,
});