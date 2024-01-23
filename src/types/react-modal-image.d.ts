import * as React from "react";
import { ModalImageProps } from "react-modal-image";

declare module "react-modal-image" {
  interface ModalImageProps {
    onClose?: () => void;
  }
}
