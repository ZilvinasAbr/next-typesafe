import { createPage } from "next-typesafe";
import { PageType } from "./_page-type";
import { z } from "zod";

export default createPage<PageType>()
  .searchParams(
    z.object({
      theme: z.enum(["light", "dark"]),
    })
  )
  .page(async ({ searchParams }) => {
    const { theme } = await searchParams;
    return (
      <div>
        <h1>Enum Search Params</h1>
        <p>Theme: {theme}</p>
      </div>
    );
  });
