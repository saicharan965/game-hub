export const environment = {
  production: false,
  type: "Local",
  apiBaseUrl: "http://localhost:5098",
  signalRBaseUrl: "http://localhost:5098/chatHub",
  auth: {
    redirect_uri: window.location.origin,
    domain: 'dev-qlvesfqc.eu.auth0.com',
    clientId: 'ZOMTwIeNvjF9qPb0B37JZhKfAlYFfy9H'
  }
};
