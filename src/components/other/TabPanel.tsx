import { MuiBox } from "lib";

interface TabPanelProps {
  children?: React.ReactNode;
  tabName: string | number;
  value: string | number;
}

export default function MuiTabPanel(props: TabPanelProps) {
  const { children, value, tabName, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== tabName}
      id={`${tabName}-tab-panel`}
      aria-labelledby={`${tabName}-tab-panel`}
      {...other}>
      {value === tabName && <MuiBox>{children}</MuiBox>}
    </div>
  );
}

export function a11yProps(name: string) {
  return {
    id: `${name}-tab`,
    "aria-controls": `${name}-tab`,
  };
}
