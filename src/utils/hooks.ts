import { useMuiMediaQuery } from "lib";
import * as React from "react";
import { useParams } from "react-router-dom";
import { TOKEN_NAME } from "types/actionTypes";

export const useIsMobile = (): boolean => {
  const matches = useMuiMediaQuery("(max-width:860px)");
  return matches;
};

export const useLoginSession = (): [
  string | null,
  (token: string | null) => void
] => {
  const getToken = React.useCallback(() => {
    let token = sessionStorage.getItem(TOKEN_NAME)
      ? sessionStorage.getItem(TOKEN_NAME)
      : null;

    token = !!token ? token : null;
    return token;
  }, []);

  const [token, setToken] = React.useState(getToken);

  const updateToken = (token: string | null) => {
    setToken(token);
    if (token) {
      sessionStorage.setItem(TOKEN_NAME, JSON.stringify(token));
    } else {
      sessionStorage.removeItem(TOKEN_NAME);
    }
  };

  React.useEffect(() => {
    setToken(getToken());
  }, [getToken]);

  return [token, updateToken];
};

export const useIds = () => {
  const { id, p_id, b_id, c_id, r_id, rp_id } = useParams<{
    id: string;
    p_id: string;
    b_id: string;
    c_id: string;
    r_id: string;
    rp_id: string;
  }>();
  const customerId = c_id?.split("__")?.[1] || "";

  return {
    customerId,
    riderId: r_id || "",
    partnerId: p_id || "",
    branchId: b_id ? +b_id : 0,
    reportId: rp_id || "",
  };
};
