import { styled, MuiTypography, MuiCardMedia } from "@/lib/index";
import { IconDefaultUserImage, IconVerification } from "lib/mui.lib.icons";
import { Link } from "react-router-dom";

type IProps =
  | {
      data: {
        fullName: string;
        date: string;
        image: string;
        verStatus: boolean;
        title?: never;
        body?: never;
      };
      className?: string;
      style?: React.HTMLAttributes<HTMLDivElement>["style"];
      viewDetailsLink?: never;
      variant: "bidder";
    }
  | {
      data: {
        title: string;
        body?: string;
        image?: string;
        fullName?: never;
        date?: never;
        verStatus?: never;
      };
      style?: React.HTMLAttributes<HTMLDivElement>["style"];
      className?: string;
      viewDetailsLink?: string;
      variant: "user";
    };

export const UserDetailCard = ({
  data,
  style,
  viewDetailsLink = "",
  variant = "user",
  className,
}: IProps) => {
  return (
    <StyledSection style={style} className={className}>
      {variant === "user" ? (
        <>
          {data?.image ? (
            <MuiCardMedia component="img" className="img" src={data?.image} />
          ) : (
            <IconDefaultUserImage className="img" />
          )}

          <div className="details">
            <MuiTypography variant="body2" className="name">
              {data?.title}
            </MuiTypography>
            <MuiTypography className="body" variant="body2">
              {data?.body}
            </MuiTypography>
            {viewDetailsLink && (
              <Link className="view-link" to={viewDetailsLink}>
                View profile
              </Link>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="image-wrapper">
            {data?.image ? (
              <MuiCardMedia component="img" className="img" src={data?.image} />
            ) : (
              <IconDefaultUserImage className="img" />
            )}
            <IconVerification className="ver-status" />
          </div>

          <div className="details bidder-details">
            <MuiTypography variant="body2" className="name">
              {data?.fullName}
            </MuiTypography>
            <MuiTypography className="body" variant="body2">
              {data?.date}
            </MuiTypography>
          </div>
        </>
      )}
    </StyledSection>
  );
};

const StyledSection = styled.section`
  display: flex;
  gap: 10px;
  align-items: center;
  border-radius: 8px;
  width: 100%;
  max-width: 410px;

  & .image-wrapper {
    position: relative;
    & .img {
      width: 50px;
      height: 50px;
    }

    & .ver-status {
      position: absolute;
      bottom: 10px;
      right: 0;
    }
  }
  & .img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    overflow: hidden;
    object-fit: cover;
  }

  & .name {
    color: #282828;
    font-weight: 700;
    margin-bottom: 5px;
    font-size: 16px;
    line-height: 1;
  }

  & .body {
    color: #777e90;
    font-size: 14px;
  }

  & .view-link {
    color: #1e75bb;
    font-size: 12px;
  }

  & .details {
    display: flex;
    gap: 0px;
    flex-direction: column;
  }

  & .bidder-details {
    & .name {
      font-size: 14px;
    }
    & .body {
      font-size: 12px;
    }
  }
`;
