import { router, useLocalSearchParams } from "expo-router";
import { Image, Text, TouchableHighlight, View } from "react-native";
import Logo from "../../assets/ecoTrack_logo.png";
import OTPTextInput from "react-native-otp-textinput";
import { useRef } from "react";
import { Button } from "react-native-paper";

const VerifyOtp = () => {
  const local = useLocalSearchParams();
  const email = local.email;

  let OtpInput = useRef(null);

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
            A 4 digit code has been sent to {email}
          </Text>
          <View className="flex-row justify-center">
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
          </View>
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
              ref={OtpInput}
            />
            <Button
            className="mt-5 py-1 w-3/4 mx-auto"
              mode="contained"
              onPress={() => {}}
            >
              <Text className="text-lg font-medium">Submit</Text>
            </Button>
          </View>
        </View>
      </View>
    </>
  );
};

export default VerifyOtp;
