import type { JobResponseResults, JobsPageProps } from "~/lib/interfaces/job";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";

import { Client } from "@notionhq/client";
import Header from "~/components/header/header";
import HeaderInfoJobDetail from "~/components/headerInfoJobDetail/headerInfoJobDetail";
import React from "react";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data.title}- ${process.env.COMPANY}` },
    {
      name: "description",
      content: `${data.title}- ${process.env.COMPANY} - Applied successfully`,
    },
  ];
};

export let loader: LoaderFunction = async ({
  params,
}): Promise<JobsPageProps> => {
  try {
    const notion = new Client({ auth: process.env.NOTION_API_KEY });

    const job = (await notion.pages.retrieve({
      page_id: params.jobId ?? "",
    })) as unknown as JobResponseResults;

    return {
      title: job.properties["Job Title"].title[0].plain_text,
      id: job.id,
      slug: job.properties.Slug.rich_text[0].plain_text,
      tag: job.properties.Tags.multi_select[0].name,
    };
  } catch (error) {
    throw new Error("Failed to load data");
  }
};
export default function Applied() {
  const job = useLoaderData<JobsPageProps>();

  return (
    <React.Fragment>
      <Header info={<HeaderInfoJobDetail title={job.title} tag={job.tag} />} />

      <div className="apply-form-component">
        <div className="container">
          <div className="applied-confirmation">
            <p>
              <i className="ion ion-checkmark-circled"></i>
            </p>
            <div className="info">
              <span>
                All done! Your application has been successfully submitted!
              </span>
            </div>
            <p>
              <a href="/">Other jobs</a>
            </p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
