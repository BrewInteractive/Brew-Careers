// import { LoaderFunction } from "@remix-run/node";
// import { useLoaderData } from "@remix-run/react";

// export let loader: LoaderFunction = async ({ params }) => {
// try {
//   const { jobSlug } = params;
//   const response = await fetch(
//     `https://jsonplaceholder.typicode.com/todos/${jobSlug}`
//   );
//   const data = await response.json();
//   return data;
// } catch (error) {
//   throw new Error("Failed to load data");
// }
// };

export default function Applied() {
  // const data = useLoaderData<typeof loader>();

  return (
    <body className="offers-controller applied" id="applied-432284">
      <div className="header-component component" id="section-112287">
        <div
          className="header-cover-image white-left-logo"
          style={{
            backgroundImage:
              "url(https://d27i7n2isjbnbi.cloudfront.net/careers/photos/102248/normal_photo_1551198210.jpg)",
          }}
        >
          <div
            className="overlay"
            style={{ backgroundColor: "#222933", opacity: "0.0" }}
          ></div>
        </div>

        <div className="white-left-logo">
          <nav className="navbar navbar-default" role="navigation">
            <div className="container">
              <h1 className="brand">
                <a href="/">
                  <img
                    title="Internship at Brew - Brew Interactive"
                    alt="Internship at Brew - Brew Interactive"
                    src="https://d27i7n2isjbnbi.cloudfront.net/careers/photos/265610/thumb_photo_1652974157.png"
                  />
                </a>
              </h1>
              <div className="pull-right buttons-wrap">
                <div className="hidden-xs hidden-sm buttons-wrap">
                  <a
                    className="company-link btn btn-primary hidden-xs"
                    target="_blank"
                    rel="nofollow noopener"
                    href="https://brewww.com"
                  >
                    Company website
                    <i className="fa fa-arrow-circle-right"></i>
                  </a>

                  <ul className="nav navbar-nav socials hidden-xs navbar-right">
                    <li>
                      <a
                        target="_blank"
                        rel="noopener"
                        href="https://www.linkedin.com/company/brew-interactive/"
                      >
                        <i className="fa fa-linkedin-square"></i>
                      </a>
                    </li>

                    <li>
                      <a
                        target="_blank"
                        rel="noopener"
                        href="http://twitter.com/brewinteractive"
                      >
                        <i className="fa fa-twitter-square"></i>
                      </a>
                    </li>

                    <li>
                      <a
                        target="_blank"
                        rel="noopener"
                        href="https://instagram.com/brew_interactive"
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
                    <a href="/#section-112289">Jobs</a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <div className="content container">
            <div className="info-container">
              <div className="info">
                <h2>Internship at Brew</h2>
                <ul>
                  <li>
                    <i className="ion ion-ios-people"></i>
                    Development
                  </li>

                  <li>
                    <i className="ion ion-location"></i>
                    Remote job
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="breadcrumbs">
          <div className="container">
            <ul>
              <li>
                <a href="https://brew.recruitee.com/">Job openings</a>
              </li>
              <li>
                <a href="https://brew.recruitee.com/o/internship-at-brew">
                  Internship at Brew
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="spacing"></div>
      </div>

      <div className="apply-form-component">
        <div className="container">
          <div className="applied-confirmation">
            <p>
              <i className="ion ion-checkmark-circled"></i>
            </p>
            <div className="info">
              <span>
                All done! Your application has been successfully submitted!
              </span>
            </div>
            <p>
              <a href="/">Other jobs</a>
            </p>
          </div>
        </div>
      </div>
    </body>
  );
}
