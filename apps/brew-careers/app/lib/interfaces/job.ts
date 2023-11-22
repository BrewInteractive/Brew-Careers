export interface JobsResponse {
  results: JobResponseResults[];
}

export interface JobResponseResults {
  properties: Properties;
  id: string;
}
export interface Properties {
  Tags: TagsProperties;
  Slug: SlugProperties;
  "Job Title": JobProperties;
}
export interface TagsProperties {
  multi_select: [{ name: string }];
}
export interface SlugProperties {
  rich_text: [{ plain_text: string }];
}

export interface JobProperties {
  title: [{ plain_text: string }];
}

export interface JobsPageProps {
  tag: string;
  id: string;
  slug: string;
  title: string;
}
