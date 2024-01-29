import type {
  ActionFunctionArgs,
  LoaderFunction,
  MetaFunction,
  TypedResponse,
} from "@remix-run/node";
import { COMPANY, COMPANY_WEBSITE_EMAIL } from "~/lib/config/companyInfo";
import type { JobResponseResults, JobsPageProps } from "~/lib/interfaces/job";
import React, { useEffect, useRef, useState } from "react";
import { useFetcher, useLoaderData } from "@remix-run/react";

import { Client } from "@notionhq/client";
import type { FormData } from "util/validation";
import Header from "~/components/header/header";
import HeaderInfoJobDetail from "~/components/headerInfoJobDetail/headerInfoJobDetail";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import type { ValidationSchema } from "../../util/validator";
import { getFileExtension } from "util/getFileExtension";
import { redirect } from "@remix-run/node";
import { useForm } from "react-hook-form";
import { uuid } from "uuidv4";
import validationSchema from "../../util/validator";
import { zodResolver } from "@hookform/resolvers/zod";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data.title}- ${COMPANY}` },
    {
      name: "description",
      content: `${data.title}- ${COMPANY} - Apply for this job`,
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

export async function action({ request, params }: ActionFunctionArgs) {
  const { STORAGE_ACCESS_KEY, STORAGE_SECRET, STORAGE_ENDPOINT } = process.env;

  if (!STORAGE_ENDPOINT && !STORAGE_ACCESS_KEY && !STORAGE_SECRET) {
    return redirect(`/`);
  }

  const formData = await request.formData();

  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  const client = new S3Client({
    region: "fra1",
    endpoint: STORAGE_ENDPOINT ?? "",
    credentials: {
      accessKeyId: STORAGE_ACCESS_KEY ?? "",
      secretAccessKey: STORAGE_SECRET ?? "",
    },
  });

  const data: FormData = {
    name: String(formData.get("name")),
    email: String(formData.get("email")),
    birthYear: String(formData.get("birthYear")),
    city: String(formData.get("city")),
    cv: formData.get("cv") as File,
    phone: String(formData.get("phone")),
    coverLetter: String(formData.get("coverLetter")),
    jobTitle: String(formData.get("jobTitle")),
  };

  const randomFileName = `${uuid()}-${params.jobId}.${getFileExtension(
    data.cv?.name ?? ""
  )}`;

  if (!data.cv) return { error: `An error has occurred when file upload` };

  const uploadFileResponse = await uploadCvFile(
    client,
    randomFileName,
    data.cv
  );

  if (uploadFileResponse.$metadata.httpStatusCode === 200) {
    const userResponse = await updateOrCreateUser(notion, data);

    if (userResponse.id) {
      const createApplicationResponse = await createApplication(
        notion,
        params.jobId as string,
        userResponse.id,
        randomFileName,
        data
      );

      if (createApplicationResponse.id) {
        return redirect(`/${params.jobSlug}/${params.jobId}/applied`);
      }
    }
  } else {
    return { error: `An error has occurred when file upload` };
  }

  return { error: `An error has occurred when save form` };
}

const createApplication = (
  notion: Client,
  jobId: string,
  userId: string,
  fileName: string,
  data: FormData
) => {
  return notion.pages.create({
    parent: {
      database_id: process.env.APPLICATION_DATABASE_ID ?? "",
    },
    properties: generateApplicationRequest(jobId, userId, fileName, data),
  });
};

const uploadCvFile = (client: S3Client, randomFileName: string, cv: File) => {
  return new Upload({
    client,
    leavePartsOnError: false,
    params: {
      Bucket: "brew-careers",
      Key: randomFileName,
      Body: cv,
      ACL: "public-read",
    },
  }).done();
};

const createUser = (notion: Client, data: FormData) => {
  return notion.pages.create({
    parent: {
      database_id: process.env.USER_DATABASE_ID ?? "",
    },
    properties: generateUserRequest(data, true),
  });
};

const updateUser = (notion: Client, userId: string, data: FormData) => {
  return notion.pages.update({
    page_id: userId,
    properties: generateUserRequest(data, false),
  });
};

const getExistingUser = (notion: Client, data: FormData) => {
  return notion.databases.query({
    database_id: process.env.USER_DATABASE_ID ?? "",
    filter: {
      property: "Email",
      email: {
        equals: data.email,
      },
    },
  });
};

const updateOrCreateUser = async (notion: Client, data: FormData) => {
  const existingUser = await getExistingUser(notion, data);

  if (existingUser && existingUser.results && existingUser.results.length > 0) {
    const userId = existingUser.results[0].id;
    return updateUser(notion, userId, data);
  } else {
    return createUser(notion, data);
  }
};

const generateUserRequest = (data: FormData, isCreate: boolean): any => {
  const request: any = {
    Name: {
      title: [
        {
          text: {
            content: data.name,
          },
        },
      ],
    },
    Email: {
      email: data.email,
    },
    Phone: {
      rich_text: [
        {
          text: {
            content: data.phone,
          },
        },
      ],
    },
    "Year of birth": {
      rich_text: [
        {
          text: {
            content: data.birthYear,
          },
        },
      ],
    },
    "City of residence": {
      rich_text: [
        {
          text: {
            content: data.city,
          },
        },
      ],
    },

    "Updated Time": {
      date: {
        start: new Date(),
      },
    },
  };

  if (isCreate) {
    request["Created Time"] = {
      date: {
        start: new Date(),
      },
    };
  }

  return request;
};

const generateApplicationRequest = (
  jobId: string,
  userId: string,
  fileName: string,
  data: FormData
): any => {
  return {
    Jobs: {
      relation: [{ id: jobId ?? "" }],
    },
    Users: {
      relation: [
        {
          id: userId,
        },
      ],
    },
    Name: {
      title: [
        {
          text: {
            content: `${data.name} (${data.jobTitle})`,
          },
        },
      ],
    },
    CV: {
      files: [
        {
          external: {
            url: `${process.env.STORAGE_FILE_URL}${fileName}`,
          },
          name: "CV",
        },
      ],
    },
    Status: {
      select: {
        name: "Applied",
      },
    },
    "Cover letter": {
      rich_text: [
        {
          text: {
            content: data.coverLetter,
          },
        },
      ],
    },
    "Created Time": {
      date: {
        start: new Date(),
      },
    },
  };
};

export default function JobApply() {
  const job = useLoaderData<JobsPageProps>();

  const formRef = useRef(null);

  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === "idle") {
      setIsButtonDisabled(false);
    }
  }, [fetcher]);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({ resolver: zodResolver(validationSchema) });

  const handleOnSubmit = async (event: any) => {
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      formData.set("jobTitle", job.title);
      fetcher.submit(formData, {
        method: "post",
        encType: "multipart/form-data",
      });
    }

    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 3000);
  };

  return (
    <React.Fragment>
      <Header info={<HeaderInfoJobDetail title={job.title} tag={job.tag} />} />
      <section>
        <div className="apply-form-component">
          <div className="container">
            <form
              ref={formRef}
              noValidate
              className="simple_form new_candidate"
              method="post"
              encType="multipart/form-data"
              onSubmit={handleSubmit(handleOnSubmit)}
            >
              <section>
                <div className="col-md-3 description">
                  <h3>My information</h3>
                  <p>Fill out the information below</p>
                </div>
                <div className="col-md-7">
                  <div
                    className={`form-group string required candidate_name ${
                      errors?.name && "has-error"
                    }`}
                  >
                    <label
                      className="string required control-label"
                      htmlFor="name"
                    >
                      Full name <abbr title="required">*</abbr>
                    </label>
                    <input
                      {...register("name")}
                      className="string required form-control"
                      required
                      aria-required="true"
                      placeholder="Your full name"
                      type="text"
                    />
                    {errors?.name && (
                      <span className="help-block">
                        {errors?.name?.message}
                      </span>
                    )}
                  </div>
                  <div
                    className={`form-group email required candidate_email ${
                      errors?.email && "has-error"
                    }`}
                  >
                    <label
                      className="email required control-label"
                      htmlFor="email"
                    >
                      Email address <abbr title="required">*</abbr>
                    </label>
                    <input
                      {...register("email")}
                      className="string email required form-control form-control"
                      required
                      aria-required="true"
                      placeholder="Your email address"
                      type="email"
                    />
                    {errors?.email && (
                      <span className="help-block">
                        {errors?.email?.message}
                      </span>
                    )}
                  </div>
                  <div
                    className={`form-group tel required candidate_phone ${
                      errors?.phone && "has-error"
                    }`}
                  >
                    <label
                      className="tel required control-label"
                      htmlFor="phone"
                    >
                      Phone number <abbr title="required">*</abbr>
                    </label>
                    <input
                      {...register("phone")}
                      className="string tel required form-control form-control"
                      required
                      aria-required="true"
                      placeholder="Example: +909999999999"
                      type="text"
                    />
                    {errors?.phone && (
                      <span className="help-block">
                        {errors?.phone?.message}
                      </span>
                    )}
                  </div>
                </div>
              </section>
              <section>
                <div className="col-md-3 description">
                  <h3>
                    CV/Resume
                    <abbr title="required">*</abbr>
                  </h3>
                  <p>Upload your CV or resume file</p>
                </div>
                <div className="col-md-7">
                  <div
                    className={`form-group file_preview required candidate_cv ${
                      errors?.cv && "has-error"
                    }`}
                  >
                    <div className="file-preview">
                      <div className="img-container">
                        <div className="file-type"></div>
                      </div>
                      <div className="footer"></div>
                      <div className="btn-delete delete-btn ion-android-delete"></div>
                    </div>
                    <button name="button" type="button">
                      Add file
                    </button>
                    <div className="hidden-field">
                      <input
                        {...register("cv")}
                        className="file_preview required select-file"
                        accept=".doc,.docx,.pdf,.png,.jpg,.mp4"
                        required
                        aria-required="true"
                        type="file"
                      />
                    </div>
                    <span className={`help-block ${errors?.cv && "has-error"}`}>
                      <span className={`help-block`}>
                        Accepted files: DOC, DOCX, PDF, ODT, RTF, JPEG and PNG
                        up to 10MB
                      </span>
                      {errors?.cv && (
                        <>
                          <br />
                          <span>{errors?.cv?.message as string}</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </section>
              <section>
                <div className="col-md-3 description">
                  <h3>Cover letter</h3>
                  <p>Insert your cover letter here</p>
                </div>
                <div className="col-md-7">
                  <div className="form-group text optional candidate_cover_letter">
                    <textarea
                      {...register("coverLetter")}
                      rows={5}
                      className="text optional form-control"
                    ></textarea>
                  </div>
                </div>
              </section>
              <section>
                <div className="col-md-3 description">
                  <h3>Questions</h3>
                  <p>Please fill in additional questions</p>
                </div>
                <div id="screening-questions" className="col-md-7">
                  <div className="question string_type">
                    <div
                      className={`form-group string required candidate_open_question_answers_content ${
                        errors?.birthYear && "has-error"
                      }`}
                    >
                      <label
                        className="string required control-label"
                        htmlFor="birthYear"
                      >
                        Year of birth <abbr title="required">*</abbr>
                      </label>
                      <input
                        {...register("birthYear")}
                        className="string required form-control"
                        required
                        aria-required="true"
                        type="text"
                      />
                      {errors?.birthYear && (
                        <span className="help-block">
                          {errors?.birthYear?.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="question string_type">
                    <div
                      className={`form-group string required candidate_open_question_answers_content  ${
                        errors?.city && "has-error"
                      }`}
                    >
                      <label
                        className="string required control-label"
                        htmlFor="city"
                      >
                        City of residence <abbr title="required">*</abbr>
                      </label>
                      <input
                        {...register("city")}
                        className="string required form-control"
                        required
                        aria-required="true"
                        type="text"
                      />
                      {errors?.city && (
                        <span className="help-block">
                          {errors?.city?.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="question infobox_type">
                    <div
                      className="alert alert-info rt-screening-question-infobox"
                      style={{ height: "300px", overflowY: "auto" }}
                    >
                      <p>
                        <strong>BREV BİLİŞİM ANONİM ŞİRKETİ </strong>
                        <strong>
                          INFORMATIVE NOTE ON PERSONAL DATA OF EMPLOYEE
                          CANDIDATES{" "}
                        </strong>
                        <strong>
                          WITHIN THE FRAMEWORK OF THE LAW ON PROTECTION OF
                          PERSONAL DATA NUMBERED 6698
                        </strong>
                      </p>
                      <p>
                        <br />
                      </p>
                      <p>
                        This Brev Bilişim Anonim Şirketi Informative Note on
                        Personal Data of Employee Candidates (“
                        <strong>Informative Note</strong>”) has been prepared by
                        Brev Bilişim Anonim Şirketi (“
                        <strong>Brev Bilişim</strong>” or “
                        <strong>Company</strong>”) as the data controller within
                        the scope of the Law on Protection of Personal Data
                        numbered 6698 and relevant secondary legislation.
                      </p>
                      <p>
                        <br />
                      </p>
                      <p>
                        This Informative Note explains in which scope your
                        personal data collected within the framework of your
                        work relationship with our Company is processed. This
                        Informative Note also contains information regarding
                        your rights in connection to your personal data.
                      </p>
                      <p>
                        <br />
                      </p>
                      <p>
                        <strong>1. PROCESSED PERSONAL DATA CATEGORIES</strong>
                      </p>
                      <p>
                        Your personal data categories that can be processed
                        within the scope of the purposes specified in the second
                        section titled "
                        <em>Purposes of Processing of Personal Data</em>" of
                        this Informative Note are as follows:
                      </p>
                      <p>
                        <br />
                      </p>
                      <ul>
                        <li>
                          Identity Information (e.g. name, surname, place of
                          birth, date of birth, marital status information)
                        </li>
                        <li>
                          Contact Information (e.g. address, email address,
                          telephone number)
                        </li>
                        <li>
                          Professional Experience (e.g. CV, diploma,
                          certificate, education information)
                        </li>
                        <li>Visual and Audio Recordings (e.g. photo)</li>
                      </ul>
                      <p>
                        <br />
                      </p>
                      <p>
                        <strong>
                          2. PURPOSES OF PROCESSING OF PERSONAL DATA
                        </strong>
                      </p>
                      <p>
                        Your personal data that you have shared within the scope
                        of your work application may be processed for the
                        purposes of planning or implementing human resources
                        processes, planning and execution of the processes of
                        receiving applications from employee candidates/trainee
                        candidates, determination and evaluation of
                        qualifications and skills required for the work
                        conditions of the employee candidates/trainee candidates
                        whose applications have been received, planning and
                        execution of activities regarding evaluation of
                        suitability to the requested position and conducting the
                        required interviews, conducting research activities
                        regarding the persons stated as references and
                        contacting these persons to confirm the information,
                        providing communication between us, evaluation of the
                        work application for other existing suitable positions
                        or other suitable positions that may become available in
                        the future, determination of wage information and scale,
                        planning and/or implementing the activities of providing
                        legal and technical security for our Company and you.
                      </p>
                      <p>
                        <br />
                      </p>
                      <p>
                        <strong>
                          3. PARTIES TO WHOM YOUR PERSONAL DATA MAY BE
                          TRANSFERRED AND PURPOSES OF TRANSFER
                        </strong>
                      </p>
                      <p>
                        Personal data you provided for the work application may
                        be shared with persons stated as references in order to
                        confirm the information you represented and to evaluate
                        your suitability to the requested position and plan and
                        execute human resources processes.
                      </p>
                      <p>
                        <br />
                      </p>
                      <p>
                        In addition, your personal data may be shared with
                        companies from which we receive services/products in
                        areas such as storage, archiving, information
                        technologies (server, hosting, program, cloud
                        computing), security, server service, e-mail, and online
                        meeting on the purpose of execution of storage and
                        archive activities, using e-mail, online meeting and
                        similar online communication methods, planning
                        information security processes and establishing and/or
                        managing information technology infrastructure.
                      </p>
                      <p>
                        <br />
                      </p>
                      <p>
                        <strong>
                          4. METHOD OF COLLECTING YOUR PERSONAL DATA, AND LEGAL
                          GROUNDS
                        </strong>
                      </p>
                      <p>
                        Your personal data, which you have submitted to our
                        Company pursuant to your request, may be collected by
                        means of curriculum vitae and other
                        information/documents you submitted to our Company by
                        hand, through electronic mail, shipment, references or
                        over the online environment; employment or consultancy
                        companies that our Company works with; referenced
                        persons, controls conducted to verify the accuracy of
                        the information provided by you and researches made by
                        our Company; application forms published in written or
                        electronic media and filled by you; verbal information
                        you gave during interviews, by fully or partially
                        automatic or non-automatic ways, based on the legal
                        ground of “<em>explicit consent</em>”.
                      </p>
                      <p>
                        <br />
                      </p>
                      <p>
                        <strong>
                          5. AS A PERSONAL DATA SUBJECT, YOUR RIGHTS UNDER
                          ARTICLE 11 OF THE LAW
                        </strong>
                      </p>
                      <p>
                        As a personal data owner, if you send us your request
                        regarding your rights by the methods set out below, we
                        will conclude your request free of charge as soon as
                        possible depending on the nature of your request and
                        within 30 (thirty) days at the latest. However, if the
                        transaction requires a separate cost, the fee determined
                        by the Personal Data Protection Board will be based on.
                        Within this context, you have the following rights, as a
                        data owner;
                      </p>
                      <ul>
                        <li>
                          to learn whether your personal data were processed or
                          not,
                        </li>
                        <li>
                          if your personal data were processed, to request
                          information on this subject,
                        </li>
                        <li>
                          to learn the purpose of the processing of your
                          personal data, and whether or not they were used in
                          compliance with the purpose,
                        </li>
                        <li>
                          to learn the third persons to whom your personal data
                          were transferred at home or abroad,
                        </li>
                        <li>
                          if your personal data were processed inaccurately or
                          incompletely, to request correction of the data, and
                          to request that the procedure performed within this
                          scope be notified to the third persons to whom your
                          personal data were transferred,
                        </li>
                        <li>
                          if, although the personal data were processed in
                          compliance with the Law and any other related
                          statutory provisions, the reasons that required
                          processing of data are no longer applicable, to
                          request that the personal data be deleted or
                          destroyed, and within this scope, and if your personal
                          data were inaccurately or incompletely processed, to
                          request that the procedure performed be notified to
                          the third persons to whom your personal data were
                          transferred,
                        </li>
                        <li>
                          to object to any results that are detrimental to you
                          as a consequence of the analysis of your personal data
                          exclusively through automated systems,
                        </li>
                        <li>
                          To request reimbursement for any kind of loss incurred
                          due to unlawful processing of your personal data.
                        </li>
                      </ul>
                      <p>
                        You can forward your application/request (1) related to
                        the above-mentioned rights to us through methods below
                        or other methods stipulated by Personal Data Protection
                        Board. <br />
                        <strong>
                          <br />
                          Written Application
                        </strong>
                      </p>
                      <p>
                        Headquarter: Vişnezade Mah. Süleyman Seba Cad. No: 79 İç
                        Kapı No: 1 Beşiktaş/İstanbul
                      </p>
                      <p>
                        <br />
                      </p>
                      <p>
                        "
                        <em>
                          Application under the Law on Protection of Personal
                          Data
                        </em>
                        " will be placed on the envelope or petition.
                        Notification can be made by hand delivery or registered
                        mail or via notary.
                      </p>
                      <p>
                        <strong>
                          <br />
                          The E-mail address registered in our company's system
                        </strong>
                      </p>
                      <p>
                        <a href={`mailto:${COMPANY_WEBSITE_EMAIL}`}>
                          {COMPANY_WEBSITE_EMAIL}
                        </a>
                      </p>
                      <p>
                        The subject section will include the phrase "
                        <em>
                          Application under the Law on Protection of Personal
                          Data
                        </em>
                        ".
                      </p>
                      <p>
                        <br />
                        (1) Pursuant to the relevant legislation, the
                        application form must include the name, surname and
                        signature if the application is in writing; for citizens
                        of the Republic of Turkey, identification number,
                        nationality for foreigners, passport number or
                        identification number, if any; residential or business
                        address; e-mail address, if any; phone and fax number
                        and the subject of the request.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <section>
                <div id="legal-questions" className="col-md-offset-3 col-md-7">
                  <div className="question legal_type">
                    <div
                      className={`form-group boolean optional candidate_open_question_answers_flag ${
                        errors?.acceptDataTransferAbroad && "has-error"
                      }`}
                    >
                      <label
                        className={`boolean optional control-label checkbox`}
                        htmlFor="acceptDataTransferAbroad"
                      >
                        <input
                          {...register("acceptDataTransferAbroad")}
                          className="boolean optional"
                          type="checkbox"
                          name="acceptDataTransferAbroad"
                          id="acceptDataTransferAbroad"
                          required
                        />
                        <div>
                          <p>
                            I have read the{" "}
                            <strong>
                              Brev Bilişim Anonim Şirketi Informative Note on
                              Personal Data
                            </strong>
                            <strong>of</strong>
                            <strong>Employee Candidates </strong>and within this
                            scope, <strong>I accept</strong> that my personal
                            data is transferred to the companies located
                            <strong>abroad</strong> from which we receive
                            services/products in areas such as storage,
                            archiving, information technologies (server,
                            hosting, program, cloud computing), security, server
                            service, e-mail, and online meeting).
                          </p>
                          {errors?.acceptDataTransferAbroad && (
                            <span className="help-block">
                              {
                                errors?.acceptDataTransferAbroad
                                  ?.message as string
                              }
                            </span>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="question legal_type">
                    <div
                      className={`form-group boolean optional candidate_open_question_answers_flag ${
                        errors?.acceptDataSharing && "has-error"
                      }`}
                    >
                      <label
                        className={`boolean optional control-label checkbox`}
                        htmlFor="acceptDataSharing"
                      >
                        <input
                          {...register("acceptDataSharing")}
                          className="boolean optional"
                          type="checkbox"
                          name="acceptDataSharing"
                          id="acceptDataSharing"
                          required
                        />
                        <div>
                          <p>
                            I have read the{" "}
                            <strong>
                              Brev Bilişim Anonim Şirketi Informative Note on
                              Personal Data
                            </strong>
                            <strong>of</strong>
                            <strong>Employee Candidates </strong>and within this
                            scope, <strong>I accept</strong> that my personal
                            data is shared with the persons I stated as
                            references.
                          </p>
                          {errors?.acceptDataSharing && (
                            <span className="help-block">
                              {errors?.acceptDataSharing?.message as string}
                            </span>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="question legal_type">
                    <div
                      className={`form-group boolean optional candidate_open_question_answers_flag  ${
                        errors?.undertakeInformingPermits && "has-error"
                      }`}
                    >
                      <label
                        className={`boolean optional control-label checkbox`}
                        htmlFor="undertakeInformingPermits"
                      >
                        <input
                          {...register("undertakeInformingPermits")}
                          className="boolean optional"
                          type="checkbox"
                          id="undertakeInformingPermits"
                          required
                        />
                        <div>
                          <p>
                            I undertake that the required informing was
                            made/permits were taken for contact in order to
                            conduct reference checks with the persons I stated
                            as references and for sharing the said personal data
                            with your Company.
                          </p>
                          {errors?.undertakeInformingPermits && (
                            <span className="help-block">
                              {
                                errors?.undertakeInformingPermits
                                  .message as string
                              }
                            </span>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </section>
              <section id="required-info">
                <div className="col-md-offset-3 col-md-7">
                  <div className="required-info help-block">
                    <abbr>*</abbr>
                    required fields
                  </div>
                </div>
              </section>
              <section className="closing">
                <button
                  className="btn btn-lg btn-primary"
                  disabled={isButtonDisabled}
                >
                  Submit application
                </button>
              </section>
            </form>
          </div>
        </div>
      </section>

      <script>LinkedInApply.maybeFillForm();</script>

      <div
        id="lightboxOverlay"
        className="lightboxOverlay"
        style={{ display: "none" }}
      ></div>
      <div id="lightbox" className="lightbox" style={{ display: "none" }}>
        <div className="lb-outerContainer">
          <div className="lb-container">
            <img
              className="lb-image"
              src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
            />
            <div className="lb-nav">
              <a className="lb-prev" href={`/${job.slug}/${job.id}/new`}></a>
              <a className="lb-next" href={`/${job.slug}/${job.id}/new`}></a>
            </div>
            <div className="lb-loader">
              <a className="lb-cancel"></a>
            </div>
          </div>
        </div>
        <div className="lb-dataContainer">
          <div className="lb-data">
            <div className="lb-details">
              <span className="lb-caption"></span>
              <span className="lb-number"></span>
            </div>
            <div className="lb-closeContainer">
              <a className="lb-close"></a>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
