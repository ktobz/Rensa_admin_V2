import * as React from "react";

const AppContext = React.createContext<{
  open: boolean;
  toggleDrawer: (state: boolean) => (data?: any) => void;
}>({
  open: false,
  toggleDrawer: () => () => false,
});

export default AppContext;
