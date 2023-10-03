import * as React from "react";
import Link, { LinkProps } from "@mui/material/Link";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { MuiTypography, styled } from "@/lib/index";
import { useURLQuery } from "@/utils/query";
// import { useURLQuery } from '@/utils/query';

interface LinkRouterProps extends LinkProps {
  to: string;
  replace?: boolean;
}

type IProp = {
  style?: React.CSSProperties;
};

const LinkRouter = (props: LinkRouterProps) => (
  <Link {...props} component={RouterLink as any} />
);

const root = "/app";

const getCustomerName = (path: string) => {
  if (path.includes("cid__") || path.includes("ptnid__")) {
    return path?.split("__")[2]?.replace("_", " ");
  }
  return path;
};

export default function BreadCrumbs({ style }: IProp) {
  const query = useURLQuery();
  const matchName = query.get("info");
  let customerId = query.get("cid") || "";
  let partnerId = query.get("ptnid") || "";
  let playerName = "";
  // const customerId2 = query.get('p_id') || '';

  // const crumbsStartIndex = 1;
  const { pathname } = useLocation();
  const pathnames = pathname
    .split("/")
    .filter((x) => x && x !== "dashboard")
    // .filter((x, index) => index > crumbsStartIndex)
    .map((x, index, paths) => {
      if (x === "app") {
        return `dashboard`;
      }

      // CUSTOMER NAME
      if (x.includes("c_id-")) {
        customerId = x.split("-")[1];
        const customerName = x.split("-")[2];
        playerName = customerId;
      }
      if (paths.length - 1 === index) {
        return `${x}?c_id=${customerId}`;
      }

      // PARTNER NAME
      if (x.includes("ptn_id-")) {
        customerId = x.split("-")[1];
        const customerName = x.split("-")[2];
        playerName = customerId;
      }
      if (paths.length - 1 === index) {
        return `${x}?ptn_id=${customerId}`;
      }
      return x;
    });
  // const playerName =

  return (
    <StyledBreadCrumb style={style}>
      <Breadcrumbs
        aria-label="breadcrumb"
        // maxItems={3}
        separator="/">
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `${root}/${pathnames.slice(0, index + 1).join("/")}`;
          const lastValue = value?.split("?")[0];
          let queryToPath = to;
          if (!!customerId) {
            queryToPath = `${to}?c_id=${customerId}`;
          }
          if (!!partnerId) {
            queryToPath = `${to}?ptn_id=${customerId}`;
          }

          return last ? (
            <MuiTypography
              color="primary"
              fontWeight={500}
              className="current-link"
              sx={{
                textTransform: "capitalize",
                fontSize: 14,
                pointerEvents: "none",
              }}
              key={to}>
              {getCustomerName(lastValue)?.toLowerCase()?.replace("-", " ") ||
                "-"}
            </MuiTypography>
          ) : value?.toLowerCase() === "submit-data" ? (
            <MuiTypography
              color="primary"
              fontWeight={500}
              className="current-link"
              sx={{
                textTransform: "capitalize",
                fontSize: 14,
                pointerEvents: "none",
              }}
              key={to}>
              {getCustomerName(value)
                ?.replaceAll(/[\-\__]/g, " ")
                ?.toLowerCase() || "-"}
            </MuiTypography>
          ) : (
            <LinkRouter
              underline="hover"
              color="success"
              className="link"
              sx={{
                textTransform: "capitalize",
                fontSize: 14,
                fontWeight: 500,
                pointerEvents: value === "match-video" ? "none" : "initial",
              }}
              to={
                value === "dashboard"
                  ? queryToPath
                  : queryToPath?.replace("/dashboard", "")
              }
              key={to}>
              {getCustomerName(value)
                ?.replaceAll(/[\-\__]/g, " ")
                ?.toLowerCase() || "-"}
            </LinkRouter>
          );
        })}
      </Breadcrumbs>
    </StyledBreadCrumb>
  );
}

const StyledBreadCrumb = styled.nav`
  display: flex;
  gap: 3px 10px;
  align-items: center;
  flex-wrap: wrap;

  & .label {
    color: #bababa;
    font-family: "Inter";
    font-style: normal;
    font-weight: 500;
  }

  & li {
    a {
      text-decoration: none;
      font-family: "Inter";
      font-style: normal;
      font-weight: 500;
    }
  }

  & .current-link {
    color: #1a1616;
  }
  & .link {
    color: #6b7280;
  }

  margin: 0px 0 20px 0;

  @media screen and (min-width: 1067px) {
    /* margin: 30px 0 20px 0; */
  }

  @media screen and (max-width: 635px) {
    margin: -20px 0 20px 0;
  }
`;
