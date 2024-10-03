import numericCards from "./cards";
import styles from "./numeric-data-card.module.scss";

const NumericDataCard = () => {
  // TODO: to be replaced with real data
  const dummyValues = {
    total_users: 100,
    total_reports: 20,
    pending_spots: 5,
    completed_reports: 15,
  };

  return (
    <div className={styles.container}>
      {numericCards.map((card, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.iconContainer}>{card.icon}</div>
          <div>
            <h1>{card.name}</h1>
            <h3>{dummyValues[card.key as keyof typeof dummyValues]}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NumericDataCard;
