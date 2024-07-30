import { useLocalSearchParams } from "expo-router";
import { Image, Text, View } from "react-native";
import Logo from "../../assets/ecoTrack_logo.png";
import OTPTextInput from "react-native-otp-textinput";
import { useRef } from "react";

const VerifyOtp = () => {

    const local = useLocalSearchParams();
    const email = local.email;

    let otpInput = useRef(null);

    return (
        <>
            <View className="flex-1 bg-white px-5 pb-5">
                <Image
                    source={Logo}
                    className="w-44 h-44 mt-8 mx-auto"
                />

                <View className="my-5">
                    <Text className="text-center text-3xl font-semibold">
                        Welcome!
                    </Text>
                    <Text className="text-center text-3xl font-semibold">
                        to
                        <Text className="text-primary font-bold"> ecoTrack</Text>
                    </Text>
                </View>

                <OTPTextInput  ref={e => (otpInput = e)} ></OTPTextInput>
            </View>
        </>
    );
}

export default VerifyOtp;