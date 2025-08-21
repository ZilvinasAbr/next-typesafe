import { createPage } from "@repo/next-typesafe/createPage";
import * as z from "zod/v4";

export default createPage()
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
