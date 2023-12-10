import { COMPANY_SLOGAN_1, COMPANY_SLOGAN_2 } from "~/lib/config/companyInfo";

import React from "react";

const HeaderInfoHome = () => {
  return (
    <React.Fragment>
      <h2>{COMPANY_SLOGAN_1}</h2>
      <h3>{COMPANY_SLOGAN_2}</h3>
    </React.Fragment>
  );
};

export default HeaderInfoHome;
