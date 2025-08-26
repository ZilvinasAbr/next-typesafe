import { ReactNode } from 'react';
import { z } from 'zod';
import type { PageProps, AppRoutes, Register } from './types';

// Re-export types for users
export type { PageProps, AppRoutes, Register } from './types';

// Type to extract route parameters from our PageProps
type ExtractParams<T> =
  T extends PageProps<any>
    ? T extends { params: Promise<infer P> }
      ? P
      : never
    : never;

// Type to check if a Zod schema represents a valid search params structure
type IsValidSearchParamsSchema<T> =
  T extends z.ZodObject<infer Shape>
    ? Shape extends Record<
        string,
        | z.ZodString
        | z.ZodEnum<any>
        | z.ZodArray<z.ZodString>
        | z.ZodOptional<z.ZodString>
        | z.ZodOptional<z.ZodEnum<any>>
        | z.ZodOptional<z.ZodArray<z.ZodString>>
        | z.ZodDefault<z.ZodString>
        | z.ZodDefault<z.ZodEnum<any>>
        | z.ZodDefault<z.ZodArray<z.ZodString>>
        | z.ZodDefault<z.ZodOptional<z.ZodString>>
        | z.ZodDefault<z.ZodOptional<z.ZodEnum<any>>>
        | z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>
      >
      ? T
      : never
    : never;

// Type to check if a Zod schema represents a valid params structure
// Next.js params are always strings, so we allow schemas that validate string values
type IsValidParamsSchema<T> =
  T extends z.ZodObject<infer Shape>
    ? Shape extends Record<
        string,
        | z.ZodString
        | z.ZodEnum<any> // Allow enums (validate string values)
        | z.ZodOptional<z.ZodString>
        | z.ZodOptional<z.ZodEnum<any>>
        | z.ZodDefault<z.ZodString>
        | z.ZodDefault<z.ZodEnum<any>>
        // Allow any coerced types that accept string input
        | z.ZodTypeAny
      >
      ? T
      : never
    : never;

// Type to validate that params schema matches PageType
// Since Next.js params are always strings but Zod can coerce/validate them,
// we relax the validation to just ensure we have compatible object shapes
type ValidateParamsSchema<TPageType, TSchema> =
  TPageType extends PageProps<any>
    ? TSchema extends z.ZodObject<z.ZodRawShape>
      ? TSchema
      : never
    : TSchema;

class PageBuilder<TState = object, TPageType = unknown> {
  private searchParamsSchema?: z.ZodTypeAny;
  private paramsSchema?: z.ZodTypeAny;
  private path: string;

  constructor(path: string) {
    this.path = path;
  }

  searchParams<T extends z.ZodTypeAny>(
    schema: IsValidSearchParamsSchema<T>,
  ): PageBuilder<TState & { searchParams: Promise<z.infer<T>> }, TPageType> {
    const builder = new PageBuilder<
      TState & { searchParams: Promise<z.infer<T>> },
      TPageType
    >(this.path);
    builder.searchParamsSchema = schema;
    builder.paramsSchema = this.paramsSchema;
    return builder;
  }

  params<T extends z.ZodTypeAny>(
    schema: ValidateParamsSchema<TPageType, IsValidParamsSchema<T>>,
  ): PageBuilder<TState & { params: Promise<z.infer<T>> }, TPageType> {
    const builder = new PageBuilder<
      TState & { params: Promise<z.infer<T>> },
      TPageType
    >(this.path);
    builder.searchParamsSchema = this.searchParamsSchema;
    builder.paramsSchema = schema;
    return builder;
  }

  page(
    page: keyof TState extends never
      ? () => Promise<ReactNode>
      : (options: TState) => Promise<ReactNode>,
  ) {
    const hasSearchParams = this.searchParamsSchema !== undefined;
    const hasParams = this.paramsSchema !== undefined;

    if (!hasSearchParams && !hasParams) {
      return async () => {
        return (page as () => Promise<ReactNode>)();
      };
    }

    return async (props: {
      searchParams?: Promise<unknown>;
      params?: Promise<unknown>;
    }) => {
      const options: Record<string, Promise<unknown>> = {};

      if (hasSearchParams && props.searchParams) {
        options.searchParams = props.searchParams.then((sp) =>
          this.searchParamsSchema!.parse(sp),
        );
      }

      if (hasParams && props.params) {
        options.params = props.params.then((p) => this.paramsSchema!.parse(p));
      }

      return (page as (options: TState) => Promise<ReactNode>)(
        options as TState,
      );
    };
  }
}

// Export the function that takes route path and uses PageProps to extract types
export function createPage<TPath extends AppRoutes>(
  path: TPath,
): PageBuilder<object, PageProps<TPath>> {
  return new PageBuilder<object, PageProps<TPath>>(path);
}
