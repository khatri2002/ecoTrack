import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import LoginIcon from "@mui/icons-material/Login";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { LoadingButton } from "@mui/lab";
import { Alert, IconButton, Snackbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Logo from "../../assets/images/ecoTrack_logo.png";
import SavePlanetImg from "../../assets/images/save-planet-concept-with-people-taking-care-earth.png";
import Input from "../../components/input/input";
import { useAuth } from "../../context/AuthProvider";
import * as api from "../../lib/api";
import { SignInInputs } from "../../lib/types";
import styles from "./sign-in.module.scss";

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [errorSnackbar, setErrorSnackbar] = useState({
    show: false,
    message: "",
  });
  const handleCloseErrorSnackbar = () => {
    setErrorSnackbar({ show: false, message: "" });
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignInInputs>();

  const { signInAction } = useAuth();

  const onSubmit: SubmitHandler<SignInInputs> = (data) => {
    setLoading(true);
    api
      .signIn(data)
      .then((response) => {
        if (response.status) {
          // valid credentials
          const token = response.access_token;
          signInAction(token);
        } else {
          // invalid credentials
          setErrorSnackbar({
            show: true,
            message: response.message,
          });
          setError("username", {
            type: response.type,
            message: response.message,
          });
          setError("password", {
            type: response.type,
            message: response.message,
          });
        }
      })
      .catch(() => {
        setErrorSnackbar({
          show: true,
          message: "Something went wrong!",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <img src={Logo} alt="ecoTrack logo" />
          <span>EcoTrack</span>
        </div>
        <div className={styles.imgContainer}>
          <img src={SavePlanetImg} alt="save planet" />
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.child}>
            <div className={styles.header}>
              <h1>Login</h1>
              <span>I'm an Admin!</span>
            </div>
            <form className={styles.fields} onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Username"
                type="text"
                register={register}
                name="username"
                rules={{ required: true }}
                error={errors.username}
              />
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOff className="text-white" />
                    ) : (
                      <Visibility className="text-white" />
                    )}
                  </IconButton>
                }
                register={register}
                name="password"
                rules={{ required: true }}
                error={errors.password}
              />
              <div className={styles.footer}>
                <LoadingButton
                  endIcon={<LoginIcon />}
                  loading={loading}
                  loadingPosition="end"
                  variant="contained"
                  sx={{
                    "&.MuiLoadingButton-loading": {
                      color: "gray !important",
                    },
                  }}
                  size={isSmallScreen ? "medium" : "large"}
                  type="submit"
                  className={styles.btn}
                >
                  Sign In
                </LoadingButton>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Snackbar
        open={errorSnackbar.show}
        autoHideDuration={6000}
        onClose={handleCloseErrorSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseErrorSnackbar}
          severity="error"
          variant="filled"
        >
          {errorSnackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SignInPage;
