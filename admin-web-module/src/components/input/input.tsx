import { FieldError, UseFormRegister } from "react-hook-form";
import styles from "./input.module.scss";
import { SignInInputs } from "../../lib/types";
import classNames from "classnames";

interface InputProps {
  label: string;
  type: string;
  endAdornment?: React.ReactNode;
  register: UseFormRegister<SignInInputs>;
  name: keyof SignInInputs;
  rules: object;
  error: FieldError | undefined;
}

const Input = ({
  label,
  type,
  endAdornment,
  register,
  name,
  rules,
  error,
}: InputProps) => {
  return (
    <div
      className={classNames({
        [styles.inputContainer]: true,
        [styles.error]: error,
      })}
    >
      <input type={type} placeholder={label} {...register(name, rules)} />
      {endAdornment}
    </div>
  );
};

export default Input;
