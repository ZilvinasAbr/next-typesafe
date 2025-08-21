import { ReactNode } from "react";
import { z } from "zod";

class PageBuilder<TState = {}> {
  private searchParamsSchema?: z.ZodTypeAny;
  private paramsSchema?: z.ZodTypeAny;

  searchParams<T extends z.ZodTypeAny>(
    schema: T
  ): PageBuilder<TState & { searchParams: Promise<z.infer<T>> }> {
    const builder = new PageBuilder<
      TState & { searchParams: Promise<z.infer<T>> }
    >();
    builder.searchParamsSchema = schema;
    builder.paramsSchema = this.paramsSchema;
    return builder;
  }

  params<T extends z.ZodTypeAny>(
    schema: T
  ): PageBuilder<TState & { params: Promise<z.infer<T>> }> {
    const builder = new PageBuilder<TState & { params: Promise<z.infer<T>> }>();
    builder.searchParamsSchema = this.searchParamsSchema;
    builder.paramsSchema = schema;
    return builder;
  }

  page(
    page: keyof TState extends never
      ? () => Promise<ReactNode>
      : (options: TState) => Promise<ReactNode>
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
          this.searchParamsSchema!.parse(sp)
        );
      }

      if (hasParams && props.params) {
        options.params = props.params.then((p) => this.paramsSchema!.parse(p));
      }

      return (page as (options: TState) => Promise<ReactNode>)(
        options as TState
      );
    };
  }
}

export function createPage(): PageBuilder<{}> {
  return new PageBuilder();
}
