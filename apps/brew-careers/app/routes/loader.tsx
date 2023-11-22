import { Client } from "@notionhq/client";
import type { LoaderFunction } from "@remix-run/node";

export let loader: LoaderFunction = async () => {
  try {
    console.log("process.env.NOTION_API_KEY", process.env.NOTION_API_KEY);

    const notion = new Client({ auth: process.env.NOTION_API_KEY });

    notion.databases
      .query({
        database_id: process.env.DATABASE_ID ?? "",
      })
      .then((response) => {
        console.log(response);
      });

    notion.blocks.children
      .list({
        block_id: "f454f442-b592-4914-9332-180b3c1a517d",
        page_size: 100,
      })
      .then((response) => {
        console.log(response);
      });
    return null;
  } catch (error) {
    throw new Error("Failed to load data");
  }
};
