// Type to extract route parameters from a path string
type ExtractRouteParams<T extends string> =
  T extends `${infer _Start}[${infer Param}]${infer Rest}`
    ? { [K in Param]: string } & ExtractRouteParams<Rest>
    : {};

// Base PageProps interface that can be augmented by users
export interface PageProps<TPath extends string = string> {
  params: Promise<ExtractRouteParams<TPath>>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Export the interface that will be augmented by users
export interface Register {
  // This will be augmented by users via module declaration
}

export type AppRoutes = Register extends { routes: infer R } ? R : never;
