import { Outlet, useLoaderData, useParams } from "@remix-run/react";

import { type LoaderFunction } from "@remix-run/node";

export let loader: LoaderFunction = async ({ params }) => {
  try {
    const { detailId } = params;
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${detailId}`
    );
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error("Failed to load data");
  }
};
export default function Detail() {
  const data = useLoaderData<typeof loader>();
  let { detailId } = useParams();
  return (
    <div>
      Detail {detailId}
      {data.title}
      {/* <Outlet /> */}
    </div>
  );
}
