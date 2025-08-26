// Test routes for the test files
declare global {
  namespace NextTypesafe {
    interface Register {
      routes:
        | '/category/[category]'
        | '/shop/[category]/[subcategory]'
        | '/products/[category]'
        | '/items/[id]/[category]'
        | '/posts/[category]'
        | '/levels/[level]'
        | '/countries/[country]'
        | '/api/[version]'
        | '/docs/[section]'
        | '/basic/[category]'
        | '/multi/[cat]/[sub]'
        | '/optional/[type]'
        | '/default/[status]'
        | '/numeric/[level]'
        | '/mixed/[id]/[type]'
        | '/geo/[country]'
        | '/search'
        | '/products'
        | '/browse'
        | '/filter';
    }
  }
}

export {};
