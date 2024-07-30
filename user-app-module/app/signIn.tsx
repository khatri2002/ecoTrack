import { Image, Text, View } from "react-native";
import Logo from "../assets/ecoTrack_logo.png";
import { Button, TextInput } from "react-native-paper";
import { useState } from "react";
import { Link } from "expo-router";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type FormData = {
    email: string
    password: string
}

const SignIn = () => {

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit: SubmitHandler<FormData> = (data) => {
        console.log(data);
    }

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

                    <View className="flex-col gap-y-1">
                        <View>
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
                                        right={<TextInput.Icon icon="email" />}
                                    />
                                )}
                                name="email"
                            />
                        </View>
                        <View>
                            <Controller
                                control={control}
                                rules={{
                                    required: true
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        mode="outlined"
                                        label="Password"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        error={errors.password ? true : false}
                                        right={
                                            <TextInput.Icon
                                                icon={isPasswordVisible ? "eye" : "eye-off"}
                                                onPress={() => setIsPasswordVisible(!isPasswordVisible)} />
                                        }
                                    />
                                )}
                                name="password"
                            />
                        </View>
                    </View>

                    <Button
                        className="mt-5 py-1 w-3/4 mx-auto"
                        mode="contained"
                        onPress={handleSubmit(onSubmit)}
                    >
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