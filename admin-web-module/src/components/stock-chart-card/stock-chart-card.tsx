import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";

import { StockChartDataValues } from "../../lib/types";

interface StockChartCardProps {
  stockChartDataValues: StockChartDataValues;
}

const StockChartCard = ({ stockChartDataValues }: StockChartCardProps) => {
  if (!stockChartDataValues) return null;
  const options = {
    rangeSelector: {
      selected: 1,
    },
    credits: {
      enabled: false,
    },
    accessibility: {
      enabled: false,
    },
    title: {
      text: "Date Wise Spots Reported",
      style: {
        fontWeight: "500",
        fontSize: "1rem",
      },
    },
    series: [
      {
        name: "No. of reports",
        data: stockChartDataValues,
      },
    ],
  };

  return (
    <div className="col-span-2 border rounded-xl p-3 bg-white">
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={options}
      />
    </div>
  );
};

export default StockChartCard;
