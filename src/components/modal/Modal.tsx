import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { MuiIconButton, muiStyled } from "lib/index";
import { DialogTitle } from "@mui/material";
import { IconClose } from "lib/mui.lib.icons";
// import SimpleBar from "simplebar-react";

// import PerfectScrollBar from "react-perfect-scrollbar";

const MuiDialogStyled = muiStyled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    width: "calc(100% - 20px)",
    margin: 0,
    borderRadius: 6,
    maxWidth: "fit-content",
    alignItems: "center",
    padding: "20px 0 20px 0",
    position: "relative",
    overflow: "hidden",
  },
  "& .MuiDialogContent-root": {
    width: "100%",
    borderRadius: 0,
  },

  "& .bg": {
    position: "absolute",
    right: "0",
    top: "10%",
    "@media screen and (max-width:700px)": {
      opacity: ".2",
    },
  },
}));

const styleCloseIcon = {
  position: "absolute" as "absolute",
  // top: "0px",
  right: "20px",
  zIndex: 2,
  padding: 0,
};

interface ModalProps {
  title?: string;
  alignTitle?: "left" | "right" | "center";
  showClose?: boolean;
  children: React.ReactNode;
  open: boolean;
  handleClose: () => void;
  closeOnOutsideClick?: boolean;
}
export default function VendgramCustomModal(props: ModalProps) {
  const {
    children,
    title,
    open,
    alignTitle = "left",
    handleClose,
    showClose = true,
    closeOnOutsideClick = true,
  } = props;

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const handleDialogClose = (
    event: {},
    reason: "backdropClick" | "escapeKeyDown"
  ) => {
    if (reason && reason === "backdropClick" && !closeOnOutsideClick) return;
    handleClose?.();
  };

  return (
    <MuiDialogStyled
      open={open}
      onClose={handleDialogClose}
      scroll="paper"
      // disableEscapeKeyDown={!showClose}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description">
      <DialogTitle
        id="scroll-dialog-title"
        sx={{
          textAlign: alignTitle,
          lineHeight: 0,
          // marginBottom: "20px",
          borderBottom: title ? "1px solid #E8E8E8" : "none",
          paddingBottom: "35px",
          paddingTop: "15px",
          position: "relative",
          fontSize: "18px",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 500,
          "@media all and (max-width:800px)": {
            fontSize: "16px",
          },
        }}>
        <b>{title}</b>

        {showClose && (
          <MuiIconButton sx={styleCloseIcon} onClick={handleClose}>
            <IconClose
              fontSize="small"
              style={{ width: "30px", height: "30px" }}
            />
          </MuiIconButton>
        )}
      </DialogTitle>
      <DialogContent
        sx={{
          width: "100%",
          overflowX: "hidden",
        }}
        id="scroll-dialog-description"
        className="scrollbar-container"
        ref={descriptionElementRef}
        tabIndex={-1}>
        {/* <SimpleBar> */}
        {/* <div
            style={{
              height: "100%",
              width: "100%",
              maxHeight: "calc(100vh - 60px)",
            }}> */}
        {/* {" "} */}
        {children}
        {/* </div> */}
        {/* </SimpleBar> */}
      </DialogContent>
    </MuiDialogStyled>
  );
}
