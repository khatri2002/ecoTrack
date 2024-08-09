import { router, useLocalSearchParams } from "expo-router";
import { Image, Text, TouchableHighlight, View } from "react-native";
import Logo from "../../assets/ecoTrack_logo.png";
import OTPTextInput from "react-native-otp-textinput";
import { useRef, useState } from "react";
import { Button } from "react-native-paper";
import { set } from "react-hook-form";
import { signUpVerifyOTP } from "../lib/api";
import { SignUpVerifyOTP } from "../lib/api_types";
import { isCustomError } from "../lib/utils";
import ErrorDialog from "../components/ErrorDialog";
import { useAuthContext } from "../context/AuthProvider";

const VerifyOtp = () => {
  const { type, ...requestBody } = useLocalSearchParams();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorDialog, setErrorDialog] = useState({
    visible: false,
    title: "",
    description: "",
  });

  const {userIn} = useAuthContext();

  const handleSubmit = async () => {
    if (otp.length < 4) {
      setError(true);
      return;
    }
    setError(false);

    try {
      setLoading(true);
      const requestBody_ = {
        first_name: requestBody.first_name as string,
        last_name: requestBody.last_name as string,
        email: requestBody.email as string,
        phone: requestBody.phone as string,
        password: requestBody.password as string,
        otp: otp as string,
      };
      const response = await signUpVerifyOTP(requestBody_);
      if (response.status) {
        await userIn(response.access_token)
        router.navigate("home");
      }
    } catch (error: unknown) {
      if (isCustomError(error)) {
        setErrorDialog({
          visible: true,
          title: error.response.data.title,
          description: error.response.data.message,
        });
      } else {
        setErrorDialog({
          visible: true,
          title: "Error",
          description: "An unknown error occurred",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View className="flex-1 bg-white px-5 pb-5">
        <Image source={Logo} className="w-44 h-44 mt-8 mx-auto" />

        <View className="my-5">
          <Text className="text-center text-3xl font-semibold">Welcome!</Text>
          <Text className="text-center text-3xl font-semibold">
            to
            <Text className="text-primary font-bold"> ecoTrack</Text>
          </Text>
        </View>

        <View className="mt-3">
          <Text className="text-center text-base font-medium">
            A 4 digit code has been sent to {requestBody.email}
          </Text>
          {/* <View className="flex-row justify-center">
            <TouchableHighlight
              activeOpacity={0.9}
              underlayColor="#DDDDDD"
              className="px-2 rounded-lg"
              onPress={() => router.navigate("otp_SignIn")}
            >
              <Text className="text-center text-primary-700 text-base font-medium">
                Change Email
              </Text>
            </TouchableHighlight>
          </View> */}
        </View>

        <View className="mt-5 bg-slate-100 rounded-md p-3">
          <Text className="text-center text-2xl font-medium mb-2">
            Enter OTP
          </Text>
          <View className="mx-7">
            <OTPTextInput
              textInputStyle={{
                borderWidth: 2,
                borderBottomWidth: 2,
                borderRadius: 5,
              }}
              handleTextChange={(text) => setOtp(text)}
            />
          </View>
          {error && (
            <View className="flex-row justify-center mt-4">
              <View className="bg-red-400 px-3 rounded-md">
                <Text className=" text-white text-base font-semibold">
                  Enter 4 digit OTP
                </Text>
              </View>
            </View>
          )}
          <Button
            className="mt-5 py-1 w-3/4 mx-auto"
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
          >
            <Text className="text-lg font-medium">Submit</Text>
          </Button>
        </View>
      </View>

      <ErrorDialog
        visible={errorDialog.visible}
        onDismiss={() =>
          setErrorDialog({ visible: false, title: "", description: "" })
        }
        title={errorDialog.title}
        description={errorDialog.description}
      />
    </>
  );
};

export default VerifyOtp;
