import React from "react";
import './styles.scss';

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_ENDPOINT}/auth/google/login-redirect`;
  };

  const commonTransformStyle = {
    opacity: 1,
    transform:
      "translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)",
    transformStyle: "preserve-3d",
  };

  return (

    <div className="hero-section">
      <div className="container">
        <img
          src="https://cdn.prod.website-files.com/656deb9359eefb9acc4ba9a7/686298b1c4d26fdfeb83c513_Group%201321317263.png"
          loading="lazy"
          width="181"
          alt=""
          className="image-3"
        />
        <div className="hero-content">
          <div className="flex-center-text">
            <a
              data-w-id="9ddaef7e-92c6-48d1-6e3b-de93cb95297f"
              style={commonTransformStyle}
              href="#"
              className="hero-link w-inline-block"
            >
              <div className="hero-link-gradient">
                <div>New</div>
              </div>
              <div>
                <strong>New Updates — Early Access October 2025</strong>
              </div>
              <div
                className="hero-link-arrow"
                style={{
                  transform:
                    "translate3d(-3px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)",
                  transformStyle: "preserve-3d",
                }}
              />
            </a>

            <a
              data-w-id="67f7d081-e774-b538-0f4e-7ccf8180a82d"
              style={commonTransformStyle}
              href="#"
              className="hero-link w-inline-block"
            >
              <div className="hero-link-gradient">
                <div>New</div>
              </div>
              <div>
                <strong>AI Stores. Hosting. Payments. Fully Automated</strong>
              </div>
              <div
                className="hero-link-arrow"
                style={{
                  transform:
                    "translate3d(-3px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)",
                  transformStyle: "preserve-3d",
                }}
              />
            </a>

            <h1
              data-w-id="775cac5c-1aa2-262a-db52-01cc6bff5d4b"
              style={commonTransformStyle}
              className="hero-text"
            >
              <strong>The Fastest Way to Launch Your </strong>
              <span className="text-span-2">Brand</span>
            </h1>

            <div
              data-w-id="94ad1a15-a764-a1ee-f194-0bd3f8dcd9ce"
              className="subscribe-form-holder w-form"
              style={commonTransformStyle}
            >
              <form
                id="wf-form-Waiting-List-Form-V2-30jun"
                name="wf-form-Waiting-List-Form-V2-30jun"
                data-name="Waiting List Form V2 (30jun)"
                method="get"
                className="subscribe-form"
                data-wf-page-id="656deb9359eefb9acc4ba9df"
                data-wf-element-id="94ad1a15-a764-a1ee-f194-0bd3f8dcd9cf"
                data-turnstile-sitekey="0x4AAAAAAAQTptj2So4dx43e"
                aria-label="Waiting List Form V2 (30jun)"
              >
                <input
                  className="subscribe-email w-input"
                  maxLength={256}
                  name="Email"
                  data-name="Email"
                  placeholder="Your mail address"
                  type="email"
                  id="Email"
                  required
                />

                <a href="#" className="button-gradient w-inline-block">
                  <div className="button-text">Get Access</div>
                </a>

                <div
                  data-w-id="f3c9c12d-963a-9c3b-d373-cfdaaf5475cd"
                  className="form-button-holder"
                >
                  <input
                    type="submit"
                    data-wait="Let's start..."
                    data-w-id="f3c9c12d-963a-9c3b-d373-cfdaaf5475ce"
                    className="form-submit-button w-button"
                    value="Reserve Spot"
                    style={{ color: "rgb(0, 0, 0)" }}
                  />
                  <div className="add-to-cart-button-border-holder">
                    <div className="add-to-cart-button-border" />
                  </div>
                  <div className="add-to-cart-button-gradient" style={{ opacity: 0 }} />
                </div>

                <div>
                  <div>
                    <iframe
                      src="https://challenges.cloudflare.com/cdn-cgi/challenge-platform/h/b/turnstile/f/ov2/av0/rch/0gvpo/0x4AAAAAAAQTptj2So4dx43e/auto/fbE/auto_expire/normal/auto"
                      allow="cross-origin-isolated; fullscreen; autoplay"
                      sandbox="allow-same-origin allow-scripts allow-popups"
                      id="cf-chl-widget-0gvpo"
                      tabIndex={-1}
                      title="Tiện ích chứa thách thức bảo mật Cloudflare"
                      aria-hidden="true"
                      style={{
                        border: "none",
                        overflow: "hidden",
                        width: 0,
                        height: 0,
                        position: "absolute",
                        visibility: "hidden",
                      }}
                    />
                    <input
                      type="hidden"
                      name="cf-turnstile-response"
                      id="cf-chl-widget-0gvpo_response"
                      value="0.XEUh6wn0Fc9bPeBbu6Xny1ykBBh6y-9b9ALkPIEQ_DSqyvfU1L1lhDN0AN2JST3tqn_m7Ro1X3PBp4Bdgpp4XU7cdMxvrAITSaikRBWC2NK2lApP-WBjn8WXDfD54jcaOKQrAXojTGzU0WdedM2ShNpThDPEXRYsGllWL7WEYEBktMVs4q-LWCr2MhNzfYSAT0lTQeE1UYqSygIhS936s7TsNEJMRiLA41T-dx7WhefmrqLKu1TTHrHU2qRyhgSKyhsw186vRoePn89XIZ0lk4IUR1WQ_89kRt-qyj9XZPSP3MWKyGKUQVqajaVYucDB_-0F7OSEJPeapaE9m5zaFQRw7Gr9g87DBjQ2_X0gzD3MbXfhUxfAhsV-1uwOS-dnbh8aw--hXh1OuzsmPbXT7wEWYpO_nxud1NQ4JBa1y-E0yAYygU_MeTNqTtphxdXP7Xf_eocPCXFB5mfsLWte5vhta12-dVbu9jOOfH2sA8Rw9ey0y30wHHLNasiriNygZJyGaT1y7kWcwB2tjEq1oH-WPxAilsQLJ86JAlFAOB6uFItkYEzmuEikJdbQFl4sWctSllUdaV-x-k6KNc710DJ894I9oMk24CYHwW6Dwq4vHnVlCFLSWbGw0fhiLdIVNQI-DCE-LTcGebc92zm3-JcSbXYMrhenW9kC3HZZKy9FKIvGPZvonAHnV2WTyNaNkBgExLf1Xv-aReo9nSRykhUS9xMLeKy_NdZJ3ociTDnfiAGwloMFpiEEHNE8D8uyzX_S_0OXeUgqUHZXX2AWPnGvwmh0GNQ9eBas8Cvln19uuTS2X9VOSsp5w3zrOXfV0EQZV-UpjXhcfKzG2UHDKjgj4EVtsDZlutgS-h4_IYI-fJn4_56mpMFMwGmF7L-L3w4JIiYRigbobh024jMcQw9kxDMQ83fo5DioEA-LLZY.6Z7MKPygqZKOlYNWWO0MQQ.a4e29776b55908cccc8d3a6232046854926ba67953134184963dc5a360ff431f"
                    />
                  </div>
                </div>
              </form>

              <div
                className="success-message w-form-done"
                tabIndex={-1}
                role="region"
                aria-label="Waiting List Form V2 (30jun) success"
              >
                <div className="gradient-text">Thank you! We got you!</div>
              </div>

              <div
                className="error-message w-form-fail"
                tabIndex={-1}
                role="region"
                aria-label="Waiting List Form V2 (30jun) failure"
              >
                <div>Oops! Something went wrong. Try again!</div>
              </div>
            </div>

            <div
              data-w-id="b043cab7-b293-8915-b3e5-69e971017d2c"
              style={commonTransformStyle}
              className="hero-description"
            >
              Everything you need to start selling — your store or landing page, done for you with AI in seconds.
            </div>
          </div>
        </div>

        <div
          data-w-id="fb4bc833-1ed5-26d2-d6d8-631c2c09a613"
          style={{ opacity: 1 }}
          className="trusted-by-container"
        >
          <div className="trusted-grid-holder" />
          <div className="trusted-by-text">Built with AI to save you time — designed to help you sell more.</div>
        </div>
      </div>

      <div className="gradient-center-holder">
        <div className="gradient-center" />
      </div>
    </div>
  );
};

export default Login;
