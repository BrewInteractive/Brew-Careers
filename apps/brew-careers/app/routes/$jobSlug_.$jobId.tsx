import type {
  JobContentResponse,
  JobDetailProps,
} from "~/lib/interfaces/job.detail";
import type { TypedResponse } from "@remix-run/node";
import {
  redirect,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Client } from "@notionhq/client";
import Header from "~/components/header/header";
import HeaderInfoJobDetail from "~/components/headerInfoJobDetail/headerInfoJobDetail";
import type { JobResponseResults } from "~/lib/interfaces/job";
import React from "react";
import notionBlocksToHtml from "util/notionBlocksToHtml/notionBlocksToHtml";
import { COMPANY } from "~/lib/config/companyInfo";
import getEnv from "util/enviroment";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data.job.title}- ${COMPANY}` },
    {
      name: "description",
      content: `${data.job.title}- ${COMPANY}`,
    },
  ];
};

export let loader: LoaderFunction = async ({
  params,
}): Promise<JobDetailProps | TypedResponse<never>> => {
  try {
    const notion = new Client({ auth: process.env.NOTION_API_KEY });

    const contentResponse = (await notion.blocks.children.list({
      block_id: params.jobId ?? "",
      page_size: 100,
    })) as unknown as JobContentResponse;

    const job = (await notion.pages.retrieve({
      page_id: params.jobId ?? "",
    })) as unknown as JobResponseResults;

    if (job?.properties["Published on Website"].checkbox !== true) {
      return redirect(`/`);
    }

    const jobsDetail = {
      job: {
        title: job.properties["Job Title"].title[0].plain_text,
        id: job.id,
        slug: job.properties.Slug.rich_text[0].plain_text,
        tag: job.properties.Tags.multi_select[0].name,
      },
      content: contentResponse,
    };

    return jobsDetail;
  } catch (error) {
    throw new Error("Failed to load data");
  }
};

export default function BusinessAnalyst() {
  const jobsDetail = useLoaderData<JobDetailProps>();
  const env = getEnv();

  return (
    <React.Fragment>
      <Header
        info={
          <HeaderInfoJobDetail
            title={jobsDetail.job.title}
            tag={jobsDetail.job.tag}
          />
        }
      />
      <section>
        <div className="offer-component">
          <div className="container">
            <div className="row">
              <div className="col-md-9 content">
                <h2 className="title">{jobsDetail.job.title}</h2>

                <div>{notionBlocksToHtml(jobsDetail.content.results)}</div>
                <div
                  className="apply hidden-xs hidden-sm mt-3"
                  style={{ marginTop: "32px" }}
                >
                  <a
                    className="btn btn-lg btn-primary"
                    href={`/${jobsDetail.job.slug}/${jobsDetail.job.id}/new`}
                  >
                    Apply for this job
                  </a>
                </div>
              </div>
              <div className="col-md-3">
                <div className="sidebar">
                  <a
                    className="btn btn-thebiggest"
                    href={`/${jobsDetail.job.slug}/${jobsDetail.job.id}/new`}
                  >
                    Apply for this job
                  </a>

                  <div className="socials-share">
                    <h4>Share this job opening</h4>
                    <div className="share clearfix">
                      <ul
                        className="rrssb-buttons clearfix rrssb-1 large-format"
                        style={{ fontSize: "18px" }}
                      >
                        <li
                          className="rrssb-linkedin"
                          data-initwidth="33.333333333333336"
                          style={{ width: "33.3333%" }}
                          data-size="57"
                        >
                          <a
                            className="popup"
                            href={`https://twitter.com/intent/tweet?text=${jobsDetail.job.title} - ${COMPANY} ${env.WEBSITE_URL}${jobsDetail.job.slug}/${jobsDetail.job.id}`}
                          >
                            <span className="rrssb-icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 28 28"
                              >
                                <path d="M25.424 15.887v8.447h-4.896v-7.882c0-1.98-.71-3.33-2.48-3.33-1.354 0-2.158.91-2.514 1.802-.13.315-.162.753-.162 1.194v8.216h-4.9s.067-13.35 0-14.73h4.9v2.087c-.01.017-.023.033-.033.05h.032v-.05c.65-1.002 1.812-2.435 4.414-2.435 3.222 0 5.638 2.106 5.638 6.632zM5.348 2.5c-1.676 0-2.772 1.093-2.772 2.54 0 1.42 1.066 2.538 2.717 2.546h.032c1.71 0 2.77-1.132 2.77-2.546C8.056 3.593 7.02 2.5 5.344 2.5h.005zm-2.48 21.834h4.896V9.604H2.867v14.73z"></path>
                              </svg>
                            </span>
                            <span className="rrssb-text">Linkedin</span>
                          </a>
                        </li>
                        <li
                          className="rrssb-facebook"
                          data-initwidth="33.333333333333336"
                          style={{ width: "33.3333%" }}
                          data-size="67"
                        >
                          <a
                            className="popup"
                            href={`https://www.facebook.com/sharer/sharer.php?u=${env.WEBSITE_URL}${jobsDetail.job.slug}/${jobsDetail.job.id}`}
                          >
                            <span className="rrssb-icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 29 29"
                              >
                                <path d="M26.4 0H2.6C1.714 0 0 1.715 0 2.6v23.8c0 .884 1.715 2.6 2.6 2.6h12.393V17.988h-3.996v-3.98h3.997v-3.062c0-3.746 2.835-5.97 6.177-5.97 1.6 0 2.444.173 2.845.226v3.792H21.18c-1.817 0-2.156.9-2.156 2.168v2.847h5.045l-.66 3.978h-4.386V29H26.4c.884 0 2.6-1.716 2.6-2.6V2.6c0-.885-1.716-2.6-2.6-2.6z"></path>
                              </svg>
                            </span>
                            <span className="rrssb-text">Facebook</span>
                          </a>
                        </li>
                        <li
                          className="rrssb-twitter"
                          data-initwidth="33.333333333333336"
                          style={{ width: "33.3333%" }}
                          data-size="53"
                        >
                          <a
                            className="popup"
                            href={`'https://twitter.com/intent/tweet?text=${jobsDetail.job.title} - ${COMPANY} ${env.WEBSITE_URL}${jobsDetail.job.slug}/${jobsDetail.job.id}'`}
                          >
                            <span className="rrssb-icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 28 28"
                              >
                                <path d="M24.253 8.756C24.69 17.08 18.297 24.182 9.97 24.62a15.093 15.093 0 0 1-8.86-2.32c2.702.18 5.375-.648 7.507-2.32a5.417 5.417 0 0 1-4.49-3.64c.802.13 1.62.077 2.4-.154a5.416 5.416 0 0 1-4.412-5.11 5.43 5.43 0 0 0 2.168.387A5.416 5.416 0 0 1 2.89 4.498a15.09 15.09 0 0 0 10.913 5.573 5.185 5.185 0 0 1 3.434-6.48 5.18 5.18 0 0 1 5.546 1.682 9.076 9.076 0 0 0 3.33-1.317 5.038 5.038 0 0 1-2.4 2.942 9.068 9.068 0 0 0 3.02-.85 5.05 5.05 0 0 1-2.48 2.71z"></path>
                              </svg>
                            </span>
                            <span className="rrssb-text">Twitter</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}
