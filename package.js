Package.describe({
  summary: "Your Membership OAuth flow",
  version: "1.0.3",
  name: "pathable:your-membership-oauth",
  git: "https://github.com/pathable/your-membership-oauth",
});

Package.onUse((api) => {
  api.versionsFrom("1.10.3-beta.9");

  api.use("ecmascript", ["client", "server"]);
  api.use("oauth2", ["client", "server"]);
  api.use("oauth", ["client", "server"]);
  api.use("http", "server");
  api.use("random", "client");
  api.use("service-configuration", ["client", "server"]);

  api.addFiles("your_membership_client.js", "client");
  api.addFiles("your_membership_server.js", "server");

  api.export("YourMembership");
});
