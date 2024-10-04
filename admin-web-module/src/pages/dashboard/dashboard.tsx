import { useEffect, useState } from "react";

import { Skeleton } from "@mui/material";

import NumericDataCard from "../../components/numeric-data-card/numeric-data-card";
import PieChartCard from "../../components/pie-chart-card/pie-chart-card";
import StockChartCard from "../../components/stock-chart-card/stock-chart-card";
import * as api from "../../lib/api";
import {
  NumericDataValues,
  PieChartDataValues,
  StockChartDataValues,
} from "../../lib/types";
import styles from "./dashboard.module.scss";

const DashBoardPage = () => {
  const [numericDataValues, setNumericDataValues] =
    useState<NumericDataValues>(null);
  const [pieChartDataValues, setPieChartDataValues] =
    useState<PieChartDataValues>(null);
  const [stockChartDataValues, setStockChartDataValues] =
    useState<StockChartDataValues>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    Promise.all([
      api.getNumericData(),
      api.getPieChartData(),
      api.getStockChartData(),
    ])
      .then((res) => {
        setNumericDataValues(res[0].data.data);
        setPieChartDataValues(res[1].data.data);
        setStockChartDataValues(res[2].data.data);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return loading ? (
    <SkeletonView />
  ) : error ? (
    <ErrorView />
  ) : (
    <div className={styles.container}>
      <NumericDataCard numericValues={numericDataValues} />
      <PieChartCard pieChartDataValues={pieChartDataValues} />
      <StockChartCard stockChartDataValues={stockChartDataValues} />
    </div>
  );
};

const SkeletonView = () => {
  return (
    <div className={styles.container}>
      <div className={styles.skeletonNumericContainer}>
        <Skeleton animation="wave" className={styles.skeleton} />
        <Skeleton animation="wave" className={styles.skeleton} />
        <Skeleton animation="wave" className={styles.skeleton} />
        <Skeleton animation="wave" className={styles.skeleton} />
      </div>
      <Skeleton animation="wave" className={styles.skeleton} />
      <Skeleton
        animation="wave"
        className={`${styles.skeleton} ${styles.stockChart}`}
      />
    </div>
  );
};

const ErrorView = () => {
  return (
    <div className={styles.errorContainer}>
      <h1>Oops, something went wrong!</h1>
      <h3>Please try again...</h3>
    </div>
  );
};

export default DashBoardPage;
