import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const PieChartCard = () => {
  const options = {
    chart: {
      height: "350px",
    },
    credits: {
      enabled: false,
    },
    accessibility: {
      enabled: false,
    },
    title: {
      text: "State Wise Spots Reported",
      style: {
        fontWeight: "500",
        fontSize: "1rem",
      },
    },
    plotOptions: {
      series: {
        cursor: "pointer",
        dataLabels: [
          {
            enabled: true,
            distance: 20,
          },
          {
            enabled: true,
            distance: -40,
            format: "{point.percentage:.1f}%",
            style: {
              fontSize: "1.2em",
              textOutline: "none",
              opacity: 0.7,
            },
          },
        ],
      },
    },
    series: [
      {
        type: "pie",
        name: "Spots Reported",
        data: [
          {
            name: "Gujarat",
            y: 100,
          },
          {
            name: "Maharashtra",
            y: 25,
          },
        ],
      },
    ],
  };
  return (
    <div className="p-3 bg-white border rounded-xl">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default PieChartCard;
