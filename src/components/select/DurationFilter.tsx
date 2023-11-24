import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  MuiIconButton,
  MuiTypography,
  styled,
  IconArrowDownIcon,
} from "@/lib/index";
import { ICategory } from "@/types/globalTypes";

const ITEM_HEIGHT = 48;

type Props = Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> & {
  selectedValue?: any;
  handleOptionSelect?: (value: string) => void;
  onChange?: () => void;
  options?: ICategory[];
};

export default function DurationFilter({
  selectedValue,
  handleOptionSelect,
  onChange,
  options,
  ...props
}: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    value: string
  ) => {
    handleOptionSelect?.(value);
    setAnchorEl(null);
  };

  return (
    <StyledSection {...props}>
      <MuiIconButton
        onClick={handleClick}
        title="Select duration"
        className="dropdown"
        aria-label="duration"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true">
        <IconArrowDownIcon />
      </MuiIconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 5.5,
            width: "12ch",
          },
        }}>
        {options?.map((option, index) => (
          <MenuItem
            key={index}
            selected={selectedValue === option?.id}
            onClick={(e) => handleMenuItemClick(e, option?.name)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 12,
              minHeight: "20px",
              borderBottom: "1px solid #eaeaea",
            }}
            value={option?.id}>
            <MuiTypography
              variant="body1"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "12px",
                color: "#262626",
                textTransform: "capitalize",
              }}>
              {option?.name?.toLowerCase()?.replaceAll("_", " ")}
            </MuiTypography>
          </MenuItem>
        ))}
      </Menu>
    </StyledSection>
  );
}

const StyledSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;

  & .dropdown {
    padding: 5px;
    border: 0.3px solid #f1f2f5;
  }

  & .list {
    border-radius: 10px;
    display: flex !important;
    gap: 20px !important;
    align-items: center !important;
    padding: 0px;
    & .text span {
      font-size: 12px !important;
    }
  }

  @media screen and (max-width: px) {
    min-width: fit-content;
    & .user-name-section {
      display: none;
    }
  }
`;
