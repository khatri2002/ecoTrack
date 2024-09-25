import { Button, IconButton } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Logo from "../../assets/images/ecoTrack_logo.png";
import SavePlanetImg from "../../assets/images/save-planet-concept-with-people-taking-care-earth.png";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import Input from "../../components/input/input";
import { useTheme } from "@mui/material/styles";
import styles from "./sign-in.module.scss";

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
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
          <div className={styles.fields}>
            <Input label="Username" type="text" />
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
            />
          </div>
          <div className={styles.footer}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "white",
                color: "black",
              }}
              size={isSmallScreen ? "medium" : "large"}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
