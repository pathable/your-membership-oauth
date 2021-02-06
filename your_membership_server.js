YourMembership = {};

YourMembership.retrieveCredential = (credentialToken, credentialSecret) =>
  OAuth.retrieveCredential(credentialToken, credentialSecret);

const YOUR_MEMBERSHIP_API_URL = "https://ws.yourmembership.com";

const POST_HEADERS = {
  "Content-Type": "application/x-www-form-urlencoded",
  Accept: "application/json",
};

const GET_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

OAuth.registerService("yourMembership", 2, null, (requestData) => {
  const { tenantId, code } = requestData;

  const config = YourMembership.getConfiguration({ tenantId });
  const { clientId, secret, ymClientId } = config;

  const {
    data: { AccessToken: accessToken },
  } = HTTP.post(`${YOUR_MEMBERSHIP_API_URL}/OAuth/GetAccessToken`, {
    params: {
      AppId: clientId,
      AppSecert: secret,
      GrantType: "Code",
      Code: code,
    },
    headers: POST_HEADERS,
  });

  const {
    data: { MemberID: memberId, SessionId: sessionId },
  } = HTTP.post(`${YOUR_MEMBERSHIP_API_URL}/Ams/Authenticate`, {
    params: {
      ConsumerKey: clientId,
      ConsumerSecret: secret,
      AccessToken: accessToken,
      ClientId: ymClientId,
      UserType: "Member",
    },
    headers: POST_HEADERS,
  });

  const { data: userData } = HTTP.get(
    `${YOUR_MEMBERSHIP_API_URL}/Ams/${ymClientId}/Member/${memberId}/BasicMemberProfile`,
    {
      headers: {
        ...GET_HEADERS,
        "X-SS-ID": sessionId,
      },
    }
  );

  const {
    FirstName: firstName,
    LastName: lastName,
    Email: emailAddress,
    MemberID: id,
  } = userData;

  const emails = emailAddress ? [emailAddress] : [];

  return {
    serviceData: {
      id,
      accessToken,
      ...userData,
    },
    options: {
      tenantId,
      profile: { firstName, lastName },
      email: emailAddress,
      emails,
    },
  };
});
