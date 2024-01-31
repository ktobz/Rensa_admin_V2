import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import "simplebar-react/dist/simplebar.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import MUIThemeConfig from "./config/theme/appTheme.config";
import ReactQueryConfig from "./config/query/reactquery.config";
import RouterConfig from "./config/router-config/router.config";
import ScrollToTop from "@/config/other/ScrollToTop";
import { useUserStore } from "config/store-config/store.config";
import { IconClose } from "@/lib/mui.lib.icons";
import AuthenticatedAppRoutes from "./routes/app-routes";
import UnAuthenticatedAppRoutes from "./routes/unauth-routes";

function App() {
  const token = useUserStore((state) => state.user?.token);

  const hasToken = !!token;
  return (
    <HelmetProvider>
      <RouterConfig>
        <ReactQueryConfig>
          <MUIThemeConfig>
            <div className="App" style={{ backgroundColor: "#F2F5F9" }}>
              <ScrollToTop />
              <ToastContainer
                progressStyle={{
                  animationDirection: "alternate-reverse",
                  color: "transparent",
                }}
                hideProgressBar={true}
                closeButton={
                  <IconClose
                    style={{
                      width: "25px !important",
                      height: "25px !important",
                    }}
                    width={25}
                    height={25}
                  />
                }
              />
              {hasToken ? (
                <AuthenticatedAppRoutes />
              ) : (
                <UnAuthenticatedAppRoutes />
              )}
            </div>
          </MUIThemeConfig>
        </ReactQueryConfig>
      </RouterConfig>
    </HelmetProvider>
  );
}

export default App;
