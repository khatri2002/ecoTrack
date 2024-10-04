import { NumericDataValues } from "../../lib/types";
import numericCards from "./cards";
import styles from "./numeric-data-card.module.scss";

interface NumericDataCardProps {
  numericValues: NumericDataValues;
}

const NumericDataCard = ({ numericValues }: NumericDataCardProps) => {
  if (!numericValues) return null;
  return (
    <div className={styles.container}>
      {numericCards.map((card, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.iconContainer}>{card.icon}</div>
          <div>
            <h1>{card.name}</h1>
            <h3>{numericValues[card.key as keyof NumericDataValues]}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NumericDataCard;
