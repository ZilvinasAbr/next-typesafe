import { createPage } from "next-typesafe";
import * as z from "zod/v4";
import type { PageType } from "./_page-type";

export default createPage<PageType>()
  .params(
    z.object({
      id: z.string(),
    })
  )
  .searchParams(
    z.object({
      name: z.string(),
    })
  )
  .page(async ({ params, searchParams }) => {
    const id = (await params).id;
    const name = (await searchParams).name;

    return (
      <div>
        Hello World {id} {name}
      </div>
    );
  });
