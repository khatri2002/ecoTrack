import { Image, Text, View } from "react-native";
import Logo from "../assets/ecoTrack_logo.png";
import { Button, TextInput } from "react-native-paper";
import { useState } from "react";
import { Link } from "expo-router";

const SignIn = () => {

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <>
            <View className="flex-1 flex flex-col bg-white justify-between px-5 pb-5">
                <View className="w-full">
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

                    <View>
                        <TextInput
                            mode="outlined"
                            label="Email"
                            right={<TextInput.Icon icon="email" />}
                        />
                        <TextInput
                            className="mt-1"
                            mode="outlined"
                            secureTextEntry={!isPasswordVisible}
                            label="Password"
                            right={
                                <TextInput.Icon
                                    icon={isPasswordVisible ? "eye" : "eye-off"}
                                    onPress={() => setIsPasswordVisible(!isPasswordVisible)} />
                            }
                        />
                    </View>

                    <Button
                        className="mt-5 py-1 w-3/4 mx-auto"
                        mode="contained"
                        onPress={() => { }}>
                        <Text className="text-lg font-medium">Login</Text>
                    </Button>
                    <Button className="mt-3">
                        <Text className="text-primary-700 text-base font-medium">
                            Login using OTP
                        </Text>
                    </Button>
                </View>

                <View>
                    <Text className="text-gray-500 text-center text-base font-medium">
                        New to ecoTrack?
                    </Text>
                    <Link href="/signUp">
                        <Text className="text-center text-primary-700 text-base font-medium underline mt-1">
                            Create an account
                        </Text>
                    </Link>
                </View>
            </View>
        </>
    );
}

export default SignIn;