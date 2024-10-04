import ChecklistIcon from "@mui/icons-material/Checklist";
import GroupIcon from "@mui/icons-material/Group";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import SummarizeIcon from "@mui/icons-material/Summarize";

import { NumericCards } from "../../lib/types";

const numericCards: NumericCards = [
  {
    name: "Total Users",
    icon: <GroupIcon />,
    key: "total_users",
  },
  {
    name: "Total Reports",
    icon: <SummarizeIcon />,
    key: "total_reports",
  },
  {
    name: "Pending Reports",
    icon: <PendingActionsIcon />,
    key: "pending_reports",
  },
  {
    name: "Completed Reports",
    icon: <ChecklistIcon />,
    key: "completed_reports",
  },
];

export default numericCards;
