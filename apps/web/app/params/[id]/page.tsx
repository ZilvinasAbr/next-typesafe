import { createPage } from "@repo/next-safe-page/createPage";
import * as z from "zod/v4";
// export default function Home() {
//   return (
//     <div className={styles.page}>
//       <main className={styles.main}>
//         <h1>Hello World</h1>
//       </main>
//     </div>
//   );
// }

export default createPage({
  searchParamsSchema: z.object({
    name: z.string(),
  }),
  paramsSchema: z.object({
    id: z.string(),
  }),
  page: async ({ searchParams, params }) => {
    const name = (await searchParams).name;
    const id = (await params).id;

    return (
      <div>
        Hello World {name} {id}
      </div>
    );
  },
});
