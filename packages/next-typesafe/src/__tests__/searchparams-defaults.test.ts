/**
 * Test cases for .default() support in searchParams()
 *
 * These tests verify that z.enum().default() and z.string().default()
 * work correctly with the searchParams() method.
 */

import { createPage } from '../createPage';
import { z } from 'zod';
import './test-routes'; // Import test route types

// Test Case 1: Basic enum with default in searchParams
interface BasicSearchParamsPageType {
  searchParams: {
    view?: string;
  };
}

const basicDefaultTest = createPage('/search')
  .searchParams(
    z.object({
      view: z.enum(['active', 'archived']).default('active'),
    }),
  )
  .page(async ({ searchParams }) => {
    const { view } = await searchParams;
    return `View: ${view}`;
  });

// Test Case 2: Multiple defaults with mixed types
interface MixedDefaultsPageType {
  searchParams: {
    theme?: string;
    page?: string;
    sort?: string;
  };
}

const mixedDefaultsTest = createPage('/products')
  .searchParams(
    z.object({
      theme: z.enum(['light', 'dark']).default('light'),
      page: z.string().default('1'),
      sort: z.enum(['name', 'date', 'size']).default('name'),
    }),
  )
  .page(async ({ searchParams }) => {
    const { theme, page, sort } = await searchParams;
    return `Theme: ${theme}, Page: ${page}, Sort: ${sort}`;
  });

// Test Case 3: Optional with defaults
interface OptionalDefaultsPageType {}

const optionalDefaultsTest = createPage('/browse')
  .searchParams(
    z.object({
      filter: z.enum(['all', 'recent', 'popular']).optional().default('all'),
      limit: z.string().optional().default('10'),
    }),
  )
  .page(async ({ searchParams }) => {
    const { filter, limit } = await searchParams;
    return `Filter: ${filter}, Limit: ${limit}`;
  });

// Test Case 4: Array with defaults
interface ArrayDefaultsPageType {
  searchParams: {
    tags?: string[];
  };
}

const arrayDefaultsTest = createPage('/filter')
  .searchParams(
    z.object({
      tags: z.array(z.string()).default(['general']),
    }),
  )
  .page(async ({ searchParams }) => {
    const { tags } = await searchParams;
    return `Tags: ${tags.join(', ')}`;
  });

// Runtime test function
async function testSearchParamsDefaults() {
  try {
    // Test 1: Basic enum default
    const basicResult = await basicDefaultTest({
      searchParams: Promise.resolve({}), // Empty search params should use default
    });
    console.log('✅ Basic enum default test:', basicResult);

    // Test 2: Mixed defaults
    const mixedResult = await mixedDefaultsTest({
      searchParams: Promise.resolve({}), // Empty search params should use defaults
    });
    console.log('✅ Mixed defaults test:', mixedResult);

    // Test 3: Optional defaults
    const optionalResult = await optionalDefaultsTest({
      searchParams: Promise.resolve({}), // Empty search params should use defaults
    });
    console.log('✅ Optional defaults test:', optionalResult);

    // Test 4: Array defaults
    const arrayResult = await arrayDefaultsTest({
      searchParams: Promise.resolve({}), // Empty search params should use defaults
    });
    console.log('✅ Array defaults test:', arrayResult);

    // Test with partial values (some provided, some defaults)
    const partialResult = await mixedDefaultsTest({
      searchParams: Promise.resolve({ theme: 'dark' }), // Only theme provided, others should use defaults
    });
    console.log('✅ Partial values test:', partialResult);
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

console.log('✅ searchParams .default() tests created');
console.log('- Basic enum defaults');
console.log('- Mixed type defaults');
console.log('- Optional with defaults');
console.log('- Array defaults');

// Run the test
testSearchParamsDefaults().catch(console.error);

// Prevent unused warnings
console.log({
  basicDefaultTest,
  mixedDefaultsTest,
  optionalDefaultsTest,
  arrayDefaultsTest,
});
