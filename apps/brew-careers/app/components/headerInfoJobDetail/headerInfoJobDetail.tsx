import type IHeaderInfoJobDetail from "./headerInfoJobDetail.types";
import React from "react";

const HeaderInfoJobDetail = ({ title, tag }: IHeaderInfoJobDetail) => {
  return (
    <React.Fragment>
      <h2> {title}</h2>
      <ul>
        <li>
          <i className="ion ion-ios-star"></i>
          {tag}
        </li>
      </ul>
    </React.Fragment>
  );
};

export default HeaderInfoJobDetail;
