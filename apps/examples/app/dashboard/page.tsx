import { createPage } from 'next-typesafe';

export default createPage('/dashboard').page(async () => {
  return <div>Dashboard</div>;
});
