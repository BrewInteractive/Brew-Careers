import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Detail Page" },
    {
      name: "description",
      content: "Detail Page",
    },
  ];
};

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
