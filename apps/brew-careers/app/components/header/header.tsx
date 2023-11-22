import type IHeader from "./header.types";

const Header = ({ info }: IHeader) => {
  return (
    <div className="header-component component" id="section-112287">
      <div
        className="header-cover-image white-left-logo"
        style={{
          backgroundImage: "url(/images/banner.jpg)",
        }}
      >
        <div
          className="overlay"
          style={{ backgroundColor: "#222933", opacity: 0 }}
        ></div>
      </div>

      <div className="white-left-logo">
        <nav className="navbar navbar-default" role="navigation">
          <div className="container">
            <h1 className="brand">
              <a href="/">
                <img
                  title={`Careers - Jobs - ${process.env.COMPANY}`}
                  alt={`Careers - Jobs - ${process.env.COMPANY}`}
                  src="/images/logo.png"
                />
              </a>
            </h1>
            <div className="pull-right buttons-wrap">
              <div className="hidden-xs hidden-sm buttons-wrap">
                <a
                  className="company-link btn btn-primary hidden-xs"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  href={process.env.COMPANY_WEBSITE}
                >
                  Company website
                  <i className="fa fa-arrow-circle-right"></i>
                </a>

                <ul className="nav navbar-nav socials hidden-xs navbar-right">
                  <li>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={process.env.COMPANY_LINKEDIN_URL}
                    >
                      <i className="fa fa-linkedin-square"></i>
                    </a>
                  </li>

                  <li>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={process.env.COMPANY_TWITTER_URL}
                    >
                      <i className="fa fa-twitter-square"></i>
                    </a>
                  </li>

                  <li>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={process.env.COMPANY_INSTAGRAM_URL}
                    >
                      <i className="fa fa-instagram"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <button
              className="navbar-toggle"
              data-target="#navbar-collapse"
              data-toggle="collapse"
              type="button"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbar-collapse">
              <ul className="menu nav navbar-nav ">
                <li>
                  <a href="/">Home</a>
                </li>

                <li>
                  <a href="/#jobs">Jobs</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="content container">
          <div className="info-container">
            <div className="info">{info}</div>
          </div>
        </div>
      </div>

      <div className="spacing"></div>
    </div>
  );
};

export default Header;
