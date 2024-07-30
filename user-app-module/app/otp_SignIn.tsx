import { Image, Text, TouchableHighlight, View } from "react-native";
import Logo from "../assets/ecoTrack_logo.png";
import { Button, TextInput } from "react-native-paper";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';

type FormData = {
    email: string
}

const Otp_SignIn = () => {

    const router = useRouter();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit: SubmitHandler<FormData> = (data) => {
        console.log(data);
        router.navigate(`verify-otp/${data.email}`);
    }

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

                <Controller
                    control={control}
                    rules={{
                        required: true,
                        pattern: /\S+@\S+\.\S+/,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            mode="outlined"
                            label="Email"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            error={errors.email ? true : false}
                            right={
                                <TextInput.Icon icon="email" style={{ pointerEvents: "none" }} />
                            }
                        />
                    )}
                    name="email"
                />

                <Button
                    className="mt-5 py-1 w-3/4 mx-auto"
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                >
                    <Text className="text-lg font-medium">Send OTP</Text>
                </Button>


                <View className="flex-row justify-center mt-4">
                    <TouchableHighlight
                        activeOpacity={0.9}
                        underlayColor="#DDDDDD"
                        className="py-1 px-2 rounded-lg"
                        onPress={() => router.navigate("signIn")}
                    >
                        <View className="flex-row items-center justify-center">
                            <AntDesign name="arrowleft" size={24} color="black" />
                            <Text className="ml-2 text-primary-700 text-base font-medium">
                                Go Back to Sign In
                            </Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        </>
    );
}

export default Otp_SignIn;