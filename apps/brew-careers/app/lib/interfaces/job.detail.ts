import type { JobsPageProps } from "./job";

export interface JobDetailProps {
  job: JobsPageProps;
  content: JobContentResponse;
}

export interface JobContentResponse {
  results: any[];
}
