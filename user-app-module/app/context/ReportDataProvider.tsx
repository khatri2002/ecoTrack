import { createContext, useContext, useState } from "react";

type ReportDataProviderProps = {
  children: React.ReactNode;
};

type Report = {
  title: string;
  id: number;
  created_at: string;
  status: {
    index: number;
    status: string;
    description: string;
  };
};

type Status = {
  index: number;
  status: string;
  description: string;
};

type ReportDataContextValue = {
  reports: Report[];
  handleSetReports: (data: Report[]) => void;
  statuses: Status[];
  handleSetStatuses: (data: Status[]) => void;
};

const ReportDataContext = createContext<ReportDataContextValue | null>(null);

const ReportDataProvider = ({ children }: ReportDataProviderProps) => {
  const [reports, setReports] = useState<Report[]>([]);
  const handleSetReports = (data: Report[]) => {
    setReports(data);
  };

  const [statuses, setStatuses] = useState<Status[]>([]);
  const handleSetStatuses = (data: Status[]) => {
    setStatuses(data);
  }

  return (
    <ReportDataContext.Provider value={{ reports, handleSetReports, statuses, handleSetStatuses }}>
      {children}
    </ReportDataContext.Provider>
  );
};

export default ReportDataProvider;

export const useReportDataContext = () => {
  const value = useContext(ReportDataContext);
  if (value === null)
    throw new Error(
      '"useReportDataContext" should be used within the ReportDataProvider!',
    );
  return value;
};
