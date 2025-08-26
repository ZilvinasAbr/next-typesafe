import type { AppRoutes } from './.next/types/routes';
// Import the Register interface to ensure the module is resolved
import type { Register } from 'next-typesafe';

declare module 'next-typesafe' {
  interface Register {
    routes: AppRoutes;
  }
}

export {};
