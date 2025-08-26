import { createPage } from 'next-typesafe';
import * as z from 'zod/v4';

export default createPage('/params/[id]')
  .params(
    z.object({
      id: z.string(),
    }),
  )
  .searchParams(
    z.object({
      name: z.string(),
    }),
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

// export default async function Page({ params }: PageProps<"/params/[id]">) {
//   const { id } = await params;

//   return <div>Hello World {id}</div>;
// }
