/* eslint-disable @typescript-eslint/consistent-type-imports */

import { Annotation } from "util/createStyleString/createStyleString.types";

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
