/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Block, RichText } from "./createHtmlElement.types";

import React from "react";
import createStyleString from "../createStyleString/createStyleString";

function createHtmlElement(block: Block): React.ReactNode {
  let elementType: string;
  let content: React.ReactNode[] = [];

  switch (block.type) {
    case "heading_1":
      elementType = "h2";
      break;
    case "heading_2":
      elementType = "h3";
      break;
    case "heading_3":
      elementType = "h4";
      break;
    case "paragraph":
      elementType = "div";
      break;
    case "bulleted_list_item":
      elementType = "li";
      break;
    default:
      // Handle other types if needed
      elementType = "div";
  }

  if (block[block.type] && block[block.type].rich_text.length < 1) {
    content.push(<div style={{ height: "40px" }}></div>);
  }

  if (block[block.type] && block[block.type].rich_text) {
    const richText: RichText[] = block[block.type].rich_text;

    richText.forEach((text, index) => {
      content.push(
        <div
          key={index}
          style={{
            ...createStyleString(text.annotations),
            ...{
              display: "inline",
            },
          }}
        >
          {text.text.content}
        </div>
      );
    });
  }

  return React.createElement(
    elementType,
    { style: { paddingBlock: "3px" } },
    content
  );
}

function createPage(blocks: Block[]): React.ReactNode {
  return blocks.map((block, index) => (
    <div key={index}>{createHtmlElement(block)}</div>
  ));
}

export default createPage;
