import React from "react";
import getEnv from "util/enviroment";

const HeaderInfoHome = () => {
  const env = getEnv();
  return (
    <React.Fragment>
      <h2>{env.COMPANY_SLOGAN_1}</h2>
      <h3>{env.COMPANY_SLOGAN_2}</h3>
    </React.Fragment>
  );
};

export default HeaderInfoHome;
