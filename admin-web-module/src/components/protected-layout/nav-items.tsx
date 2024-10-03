import DashboardIcon from "@mui/icons-material/Dashboard";

import { NavItems } from "../../lib/types";

const navItems: NavItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: <DashboardIcon />,
  },
  {
    name: "some",
    path: "/some",
    icon: <DashboardIcon />,
  },
];

export default navItems;
