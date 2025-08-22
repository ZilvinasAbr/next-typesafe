import { createPage } from "@repo/next-typesafe/createPage";
import * as z from "zod/v4";
export default createPage()
  .searchParams(
    z.object({
      name: z.string().optional(),
    })
  )
  .page(async ({ searchParams }) => {
    const name = (await searchParams).name;

    return <div>Hello World {name}</div>;
  });
