export const environment = {
  production: true,
  type: "Production",
  apiBaseUrl: "https://snake-master-api.azurewebsites.net",
  signalRBaseUrl: "https://snake-master-api.azurewebsites.net/chatHub",
  auth: {
    redirect_uri: window.location.origin,
    domain: 'dev-qlvesfqc.eu.auth0.com',
    clientId: 'ZOMTwIeNvjF9qPb0B37JZhKfAlYFfy9H'
  }
};
