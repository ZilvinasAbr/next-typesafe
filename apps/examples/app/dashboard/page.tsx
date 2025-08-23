import { createPage } from "next-typesafe";
import { PageType } from "./_page-type";

export default createPage<PageType>().page(async () => {
  return <div>Dashboard</div>;
});
