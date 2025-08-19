import { ReactNode } from "react";
import { z } from "zod";

export const createPage =
  <
    TSearchParamsSchema extends z.ZodTypeAny,
    TParamsSchema extends z.ZodTypeAny,
  >({
    searchParamsSchema,
    paramsSchema,
    page,
  }: {
    searchParamsSchema: TSearchParamsSchema;
    paramsSchema: TParamsSchema;
    page: (options: {
      searchParams: Promise<z.infer<TSearchParamsSchema>>;
      params: Promise<z.infer<TParamsSchema>>;
    }) => Promise<ReactNode>;
  }) =>
  async ({
    searchParams: unparsedSearchParams,
    params: unparsedParams,
  }: {
    searchParams: Promise<unknown>;
    params: Promise<unknown>;
  }) => {
    const searchParams = unparsedSearchParams.then((sp) => {
      return searchParamsSchema.parse(sp);
    });

    const params = unparsedParams.then((p) => {
      return paramsSchema.parse(p);
    });

    return page({ searchParams, params });
  };
