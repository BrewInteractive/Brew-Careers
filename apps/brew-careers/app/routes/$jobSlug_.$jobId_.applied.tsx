import type { JobResponseResults, JobsPageProps } from "~/lib/interfaces/job";
import type {
  LoaderFunction,
  MetaFunction,
  TypedResponse,
} from "@remix-run/node";
import { useLoaderData, useLocation } from "@remix-run/react";

import { COMPANY } from "~/lib/config/companyInfo";
import { Client } from "@notionhq/client";
import Header from "~/components/header/header";
import HeaderInfoJobDetail from "~/components/headerInfoJobDetail/headerInfoJobDetail";
import React from "react";
import { redirect } from "@remix-run/node";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data.title}- ${COMPANY}` },
    {
      name: "description",
      content: `${data.title}- ${COMPANY} - Applied successfully`,
    },
  ];
};

export let loader: LoaderFunction = async ({
  params,
}): Promise<JobsPageProps | TypedResponse<never>> => {
  try {
    const notion = new Client({ auth: process.env.NOTION_API_KEY });

    const job = (await notion.pages.retrieve({
      page_id: params.jobId ?? "",
    })) as unknown as JobResponseResults;

    if (job?.properties["Published on Website"].checkbox !== true) {
      return redirect(`/`);
    }

    return {
      title: job.properties["Job Title"].title[0].plain_text,
      id: job.id,
      slug: job.properties.Slug.rich_text[0].plain_text,
      tag: job.properties.Tags.multi_select[0].name,
    };
  } catch (error) {
    return redirect(`/`);
  }
};

export default function Applied() {
  const job = useLoaderData<JobsPageProps>();

  const location = useLocation();

  window.history.pushState(null, "", window.location.href);

  window.onpopstate = function (event) {
    let backUrl = location.pathname.slice(0, -"/applied".length) + "/new";

    window.location.href = backUrl;
  };

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
