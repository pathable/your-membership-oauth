import Cookies from "js-cookie";
const SCOPE = "scope";

YourMembership = {};

YourMembership.requestCredential = (
  options,
  credentialRequestCompleteCallback
) => {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === "function") {
    // eslint-disable-next-line no-param-reassign
    credentialRequestCompleteCallback = options;
    // eslint-disable-next-line no-param-reassign
    options = {};
  }

  const config = options.config;
  const credentialToken = Random.secret();

  const loginStyle = "redirect";

  const loginUrlParameters = {
    app_id: config.clientId,
    response_type: "code",
    redirect_uri: config.ymRedirectUrl,
    scope: "basic_profile",
  };

  const loginUrl = `${config.ymLoginUrl}?${Object.keys(loginUrlParameters)
    .map(
      (param) =>
        `${encodeURIComponent(param)}=${encodeURIComponent(
          loginUrlParameters[param]
        )}`
    )
    .join("&")}`;

  const currentCookie = JSON.parse(Cookies.get(SCOPE));

  const newCookies = { ...currentCookie, ...config, credentialToken };

  Cookies.set(SCOPE, JSON.stringify(newCookies));

  OAuth.launchLogin({
    loginService: "yourMembership",
    loginStyle,
    loginUrl,
    credentialRequestCompleteCallback,
    credentialToken,
  });
};
