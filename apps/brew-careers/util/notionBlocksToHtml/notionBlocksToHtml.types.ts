import type { Annotation } from "util/notionAnnotationToCssProperties/notionAnnotationToCssProperties.types";

export interface Block {
  object: string;
  id: string;
  type: string;
  [key: string]: any;
}

export interface RichText {
  type: string;
  text: {
    content: string;
    link: string | null;
  };
  annotations: Annotation;
}
