/* eslint-disable jsx-a11y/alt-text */
import { Client } from "@notionhq/client";
import { type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Header from "~/components/header/header";
import HeaderInfoHome from "~/components/headerInfoHome/headerInfoHome";
import { COMPANY } from "~/lib/config/companyInfo";
import type { JobsPageProps, JobsResponse } from "~/lib/interfaces/job";

export let loader: LoaderFunction = async (): Promise<JobsPageProps[]> => {
  try {
    const notion = new Client({ auth: process.env.NOTION_API_KEY });

    const response = (await notion.databases.query({
      database_id: process.env.JOBS_DATABASE_ID ?? "",
      filter: {
        property: "Published on Website",
        checkbox: {
          equals: true,
        },
      },
    })) as unknown as JobsResponse;

    return response.results.map((job) => {
      return {
        tag: job.properties.Tags.multi_select[0].name,
        id: job.id,
        slug: job.properties.Slug.rich_text[0].plain_text,
        title: job.properties["Job Title"].title[0].plain_text,
      };
    });
  } catch (error) {
    throw new Error("Failed to load data");
  }
};

export default function Home() {
  const jobs = useLoaderData<JobsPageProps[]>();

  return (
    <body className="offers-controller index" id="index">
      <div id="components-container">
        <Header info={<HeaderInfoHome />} />

        <div className="text-component component" id="section-112288">
          <div className="no-photo container">
            <h3 className="section-title">We are {COMPANY}</h3>

            <h4 className="section-subtitle">
              Named before 3rd wave coffee shops and home-brewing became popular
            </h4>

            <div className="text row">
              <div className="body col-xs-12">
                <p className="text-center">
                  <span style={{ fontSize: "16px" }}>
                    We are a UX and frontend focused development studio, serving
                    domestic and international clients with their software
                    products. Here at Brew, we love good UX and design; we love
                    good engineering and development practices; we love
                    open-source; we love agile; we love code-reviews and
                    mentoring; we love working with alpha releases…
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="offers-component component" id="jobs">
          <div className="container">
            <h3 className="section-title">Join the team</h3>

            <h4 className="section-subtitle">Current openings</h4>

            <div className="simple-view">
              <div className="jobs" id="jobs-list">
                <div className="filters-container"></div>
                <div className="clearfix"></div>
                <div className="list-container list">
                  {jobs.map((job, index) => (
                    <div className="job" id="job-1104965" key={`job-${index}`}>
                      <div className="row">
                        <div className="col-md-8 col-xs-12 col-centered">
                          <h5 className="job-title">
                            <a href={`/${job.slug}/${job.id}`}>{job.title}</a>
                          </h5>

                          <div className="department">{job.tag}</div>
                        </div>
                        <div className="col-md-4 col-xs-12 apply-now col-centered">
                          <a
                            className="btn btn-primary"
                            href={`/${job.slug}/${job.id}`}
                          >
                            View job
                          </a>
                        </div>

                        <div className="job-data hidden">
                          <div className="language">["en"]</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="empty-state hidden">
                  <h3>No job openings found</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="perks-component component" id="section-112322">
          <div
            className="perks-background-image"
            style={{
              backgroundImage: "url(/images/benefits.jpg)",
              backgroundColor: "white",
            }}
          >
            <div
              className="overlay"
              style={{ backgroundColor: "#222933", opacity: 0 }}
            ></div>
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <h3 className="section-title">Perks &amp; Benefits</h3>

                  <h4 className="section-subtitle">
                    A selection of what we have to offer
                  </h4>
                </div>
              </div>
              <div className="entry row row-centered">
                <div className="col-md-4">
                  <ul>
                    <li>
                      Ability to work remote or in our offices in Urla and Izmir
                      downtown
                    </li>

                    <li>Employee oriented, flexible working environment</li>

                    <li>No extra hours</li>
                  </ul>
                </div>

                <div className="col-md-4">
                  <ul>
                    <li>
                      Fast-paced learning environment in a multi-talent team
                    </li>

                    <li>
                      Private health insurance, meal vouchers, co-working
                      memberships
                    </li>

                    <li>Competitive salary</li>
                  </ul>
                </div>

                <div className="col-md-4">
                  <ul>
                    <li>Professional support for career development</li>

                    <li>Top of the line computing equipment and software</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="html-component component" id="section-325655">
          <div className="container">
            <div className="text row">
              <div className="body col-xs-12">
                <div className="container">
                  <h3 className="section-title">
                    Our team thinks that BREW is GREAT!
                  </h3>

                  <h4 className="section-subtitle">
                    This is where you thrive!
                  </h4>

                  <div className="text row">
                    <div className="photo col-md-2">
                      <img
                        className="img-rounded"
                        src="images/CertificationBadge.png"
                      />
                    </div>
                    <div className="body col-md-10">
                      <p>
                        BREW has officially been recognized by the Great Place
                        to Work Institute based on feedback from our amazing
                        team. The Institute is committed to improving workplaces
                        so that every employee can thrive, and their survey
                        provides an objective assessment of the employee
                        experience.
                      </p>
                      <p>
                        Thanks to our team's positive responses, we've earned
                        the Great Place to Work certification with a 95% score.
                        At BREW, "Being a team" has always been a top value, and
                        we're grateful to our team for making it a reality
                        through their unwavering support and presence.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
}
