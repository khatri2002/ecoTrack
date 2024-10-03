import NumericDataCard from "../../components/numeric-data-card/numeric-data-card";
import PieChartCard from "../../components/pie-chart-card/pie-chart-card";
import StockChartCard from "../../components/stock-chart-card/stock-chart-card";
import styles from "./dashboard.module.scss";

const DashBoardPage = () => {
  return (
    <div className={styles.container}>
      <NumericDataCard />
      <PieChartCard />
      <StockChartCard />
    </div>
  );
};

export default DashBoardPage;
