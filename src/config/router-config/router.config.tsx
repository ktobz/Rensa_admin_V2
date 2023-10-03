import { BrowserRouter as Router } from "react-router-dom";

export default function RouterConfig({ children }: { children: any }) {
  return <Router>{children}</Router>;
}
