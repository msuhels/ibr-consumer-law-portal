let BackendUrl = "";
let FrontendUrl = "";
let CookiesUrl = "";
let ProductionType = "";
let CaptchaAppKey = "";
let LobApiKey = "";
let Stripe_Publishable_key = "";
let BackendDomainSocketUrl = "";
let OpenAIKey = "";

if (process.env.VITE_OPEN_AI_API_KEY) {
  OpenAIKey = process.env.VITE_OPEN_AI_API_KEY;
} else {
  OpenAIKey = import.meta.env.VITE_OPEN_AI_API_KEY;
}

if (process.env.LOB_API_KEY) {
  LobApiKey = process.env.LOB_API_KEY;
} else {
  LobApiKey = import.meta.env.VITE_LOB_API_KEY;
}


if (process.env.APP_CAPTCHA_KEY) {
  CaptchaAppKey = process.env.APP_CAPTCHA_KEY;
} else {
  CaptchaAppKey = import.meta.env.VITE_APP_CAPTCHA_KEY;
}


if (process.env.COOKIES_BASE_URL) {
  CookiesUrl = process.env.COOKIES_BASE_URL;
} else {
  CookiesUrl = import.meta.env.VITE_COOKIES_ROUTE;
}

if (process.env.PRODUCTION_TYPE) {
  ProductionType = process.env.PRODUCTION_TYPE;
} else {
  ProductionType = import.meta.env.VITE_PRODUCTION_TYPE;
}

if (process.env.API_BASE_URL) {
  BackendUrl = process.env.API_BASE_URL;
} else {
  BackendUrl = import.meta.env.VITE_API_BASE_URL;
}
if (process.env.FRONTEND_ROUTE) {
  FrontendUrl = process.env.FRONTEND_ROUTE;
} else {
  FrontendUrl = import.meta.env.VITE_FRONTEND_ROUTE;
}
if (process.env.STRIPE_PUBLISHABLE_KEY) {
  Stripe_Publishable_key = process.env.STRIPE_PUBLISHABLE_KEY;
} else {
  Stripe_Publishable_key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
}
if (process.env.BACKEND_DOMAIN_SOCKET_URL) {
  BackendDomainSocketUrl = process.env.BACKEND_DOMAIN_SOCKET_URL;
} else {
  BackendDomainSocketUrl = import.meta.env.VITE_API_BACKEND_SOCKET_URL;
}

export { BackendUrl, FrontendUrl, Stripe_Publishable_key, CookiesUrl, ProductionType ,CaptchaAppKey ,LobApiKey, BackendDomainSocketUrl ,OpenAIKey};
 