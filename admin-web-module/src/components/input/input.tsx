import styles from "./input.module.scss";

interface InputProps {
  label: string;
  type: string;
  endAdornment?: React.ReactNode;
}

const Input = ({ label, type, endAdornment }: InputProps) => {
  return (
    <div className={styles.inputContainer}>
      <input type={type} placeholder={label} />
      {endAdornment}
    </div>
  );
};

export default Input;
