// This file augments the next-typesafe library with your app's specific routes
// Import the generated AppRoutes from Next.js
import type { AppRoutes } from './.next/types/routes';

declare global {
  namespace NextTypesafe {
    interface Register {
      routes: AppRoutes;
    }
  }
}

export {};
