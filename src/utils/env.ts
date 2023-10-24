// eslint-disable-next-line prefer-destructuring
const env = import.meta.env;

const APP_VARS = {
  mode: env.MODE,
  baseApi: env.VITE_BASE_API,
  googleAPI: env.VITE_GOOGLE_API,
};

export default APP_VARS;
