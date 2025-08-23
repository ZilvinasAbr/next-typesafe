import { createPage } from "next-typesafe";
import * as z from "zod/v4";
import { PageType } from "./_page-type";

export default createPage<PageType>()
  .params(
    z.object({
      itemId: z.string(),
    })
  )
  .page(async ({ params }) => {
    const itemId = (await params).itemId;
    return <div>Dashboard {itemId}</div>;
  });
