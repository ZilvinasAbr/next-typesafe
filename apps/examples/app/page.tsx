import { createPage } from "next-typesafe";
import * as z from "zod/v4";
import { PageType } from "./_page-type";

export default createPage<PageType>()
  .searchParams(
    z.object({
      name: z.string().optional(),
    })
  )
  .page(async ({ searchParams }) => {
    const name = (await searchParams).name;

    return <div>Hello World {name}</div>;
  });
