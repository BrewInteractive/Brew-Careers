import React from "react";

const HeaderInfoHome = () => {
  return (
    <React.Fragment>
      <h2>{process.env.COMPANY_SLOGAN_1}</h2>
      <h3>{process.env.COMPANY_SLOGAN_2}</h3>
    </React.Fragment>
  );
};

export default HeaderInfoHome;
