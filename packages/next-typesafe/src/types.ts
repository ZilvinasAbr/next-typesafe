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

// Module augmentation interface for users to extend
declare global {
  namespace NextTypesafe {
    interface Register {
      // Users must augment this interface - no default provided
      // routes: string; // This should be overridden by user
    }
  }
}

// Extract the routes type from the Register interface
// If not augmented, this will be never, forcing users to define their routes
export type AppRoutes = NextTypesafe.Register extends { routes: infer R }
  ? R
  : never;
