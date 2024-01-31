import { Typography, TypographyProps } from "@mui/material";

export default function Subtitle({ children, ...otherProps }: TypographyProps) {
  return (
    <Typography
      fontWeight="400"
      // color="secondary"
      fontSize={15}
      style={{ color: "#6E6B7B" }}
      sx={{
        "@media screen and (max-width:968px)": {
          fontSize: "15px",
        },
        "@media screen and (max-width:568px)": {
          fontSize: "12px",
        },
      }}
      {...otherProps}>
      {children}
    </Typography>
  );
}
