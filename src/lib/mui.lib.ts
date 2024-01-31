// COMPONENTS
import Button, { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MuiHelperText from "@mui/material/FormHelperText";
import Dialog from "@mui/material/Dialog";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { TypographyProps } from "@mui/material";
import CardMedia, {
  CardMediaProps as MuiCardMediaProps,
} from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import MuiTabs from "@mui/material/Tabs";
import MuiTab from "@mui/material/Tab";
import MuiAvatar from "@mui/material/Avatar";
import MuiSkeleton from "@mui/material/Skeleton";
import MuiMenu, { type MenuProps as MuiMenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import { SelectProps, SelectChangeEvent } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import MuiInputAdornment from "@mui/material/InputAdornment";
import { styled as muiStyled, alpha as MuiAlpha } from "@mui/material/styles";
import { TextFieldProps as MuiTextFieldProps } from "@mui/material/TextField";
import Popover from "@mui/material/Popover";
import Slider from "@mui/material/Slider";
import Chip from "@mui/material/Chip";
import MuiMenuList from "@mui/material/MenuList";
import ListItem from "@mui/material/ListItem";
import MuiCardActionArea from "@mui/material/CardActionArea";
import MuiTable from "@mui/material/Table";
import MuiTableBody from "@mui/material/TableBody";
import MuiTableCell from "@mui/material/TableCell";
import MuiTableContainer from "@mui/material/TableContainer";
import MuiTableHead from "@mui/material/TableHead";
import MuiTableRow from "@mui/material/TableRow";
import MuiPaper from "@mui/material/Paper";
import MuiFab from "@mui/material/Fab";
import MuiOutlinedInput from "@mui/material/OutlinedInput";

import MuiTooltip, {
  TooltipProps as MuiTooltipProps,
  tooltipClasses as MuitooltipClasses,
} from "@mui/material/Tooltip";
import MuiListItemIcon from "@mui/material/ListItemIcon";

import MuiLinearProgress, {
  linearProgressClasses as MuiLinearProgressClasses,
} from "@mui/material/LinearProgress";

import useMuiMediaQuery from "@mui/material/useMediaQuery";

import Pagination from "@mui/material/Pagination";
import MuiCircularProgress, {
  CircularProgressProps as MuiCircularProgressProps,
  circularProgressClasses as MuicircularProgressClasses,
} from "@mui/material/CircularProgress";
import Switch, { SwitchProps } from "@mui/material/Switch";

export {
  MuiOutlinedInput,
  MuiHelperText,
  Switch as MuiSwitch,
  type SwitchProps as MuiSwitchProps,
  MuiListItemIcon,
  MuiTooltip,
  type MuiTooltipProps,
  MuitooltipClasses,
  MuiMenuList,
  MuiFab,
  MuiPaper,
  MuiLinearProgressClasses,
  MuiLinearProgress,
  type SelectProps as MuiSelectProps,
  type SelectChangeEvent as MuiSelectChangeEvent,
  MuiTable,
  MuiTableBody,
  MuiTableCell,
  MuiTableContainer,
  MuiTableHead,
  MuiTableRow,
  MuiTab,
  MuiMenuProps,
  MuiMenu,
  Button as MuiButton,
  TextField as MuiTextField,
  Select as MuiSelect,
  Dialog as MuiDialog,
  Typography as MuiTypography,
  Fade as MuiFade,
  Modal as MuiModal,
  Backdrop as MuiBackdrop,
  Box as MuiBox,
  CardMedia as MuiCardMedia,
  type MuiCardMediaProps,
  Card as MuiCard,
  IconButton as MuiIconButton,
  FormControl as MuiFormControl,
  InputLabel as MuiInputLabel,
  InputBase as MuiInputBase,
  Divider as MuiDivider,
  Checkbox as MuiCheckbox,
  FormControlLabel as MuiFormControlLabel,
  RadioGroup as MuiRadioGroup,
  Radio as MuiRadio,
  MuiInputAdornment,
  MenuItem as MuiMenuItem,
  ListItemText as MuiListItemText,
  Pagination as MuiPagination,
  Popover as MuiPopover,
  Slider as MuiSlider,
  Chip as MuiChip,
  ListItem as MuiListItem,
  useMuiMediaQuery,
  MuiCircularProgress,
  MuiTabs,
  MuiCardActionArea,
  MuiAvatar,
  MuiSkeleton,
  type MuiTextFieldProps,
  type TypographyProps as MuiTypographyProps,
  type MuiCircularProgressProps,
  MuicircularProgressClasses,
  type MuiButtonProps,
};

// STYLING

export { muiStyled, MuiAlpha };

// STYLING
