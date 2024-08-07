import { Image, ScrollView, Text, Touchable, TouchableHighlight, View } from "react-native";
import Logo from "../assets/ecoTrack_logo.png";
import { Button, TextInput } from "react-native-paper";
import { Link, useRouter } from "expo-router";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useState } from "react";

type FormData = {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    confirmPassword: string
}

const SignUp = () => {

    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        setValue,
        clearErrors,
        getValues,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit: SubmitHandler<FormData> = (data) => {
        console.log(data);
    }

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    // Password validation checks
    const regexChecks = [
        { regex: /[a-z]/, message: 'Must contain at least one lowercase letter' },
        { regex: /[A-Z]/, message: 'Must contain at least one uppercase letter' },
        { regex: /[0-9]/, message: 'Must contain at least one number' },
        { regex: /[^a-zA-Z0-9]/, message: 'Must contain at least one special character' },
        { regex: /^.{8,}$/, message: 'Must be at least 8 characters long' },
    ];

    const handlePasswordChange = (password: string) => {
        setValue('password', password);

        const errors: string[] = [];
        regexChecks.forEach(({ regex, message }) => {
            if (!regex.test(password)) {
                errors.push(message);
            }
        });

        if (errors.length > 0) {
            setError('password', { message: errors.join(',') });
        }
        else {
            clearErrors('password');
        }
    }

    const handleConfirmPasswordChange = (confirmPassword: string) => {
        setValue('confirmPassword', confirmPassword);

        if (confirmPassword != getValues('password')) {
            setError('confirmPassword', { message: 'Passwords do not match' });
        }
        else {
            clearErrors('confirmPassword');
        }
    }

    return (
        <>
            <ScrollView className="flex-1 bg-white px-5" keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets={true}>
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

                <View className="flex-1 flex-col gap-y-2">
                    <View className="flex-1 flex-row gap-x-4">
                        <View className="flex-1">
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                    minLength: 2,
                                    maxLength: 20,
                                    pattern: /^[A-Za-z]+$/i,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        mode="outlined"
                                        label="First Name"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        error={errors.firstName ? true : false}
                                    />
                                )}
                                name="firstName"
                            />
                        </View>
                        <View className="flex-1">
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                    minLength: 2,
                                    maxLength: 20,
                                    pattern: /^[A-Za-z]+$/i,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        mode="outlined"
                                        label="Last Name"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        error={errors.lastName ? true : false}
                                    />
                                )}
                                name="lastName"
                            />
                        </View>
                    </View>
                    <View className="flex-1">
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                                pattern: /\S+@\S+\.\S+/,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    className="flex-1"
                                    mode="outlined"
                                    label="Email"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    error={errors.email ? true : false}
                                />
                            )}
                            name="email"
                        />
                    </View>
                    <View className="flex-1">
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                                pattern: /^[0-9\b]+$/,
                                minLength: 10,
                                maxLength: 10,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    mode="outlined"
                                    label="Phone"
                                    keyboardType="numeric"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    error={errors.phone ? true : false}
                                />
                            )}
                            name="phone"
                        />
                    </View>
                    <View className="flex-1">
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                                validate: () => {
                                    if (errors.password) {
                                        return errors.password.message;
                                    }
                                    return true;
                                }
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <TextInput
                                        mode="outlined"
                                        label="Create New Password"
                                        onBlur={onBlur}
                                        onChangeText={(text) => {
                                            handlePasswordChange(text);
                                        }}
                                        value={value}
                                        error={errors.password ? true : false}
                                        secureTextEntry={!isPasswordVisible}
                                        right={
                                            <TextInput.Icon
                                                icon={isPasswordVisible ? "eye" : "eye-off"}
                                                onPress={() => setIsPasswordVisible(!isPasswordVisible)} />
                                        }
                                    />
                                </>
                            )}
                            name="password"
                        />
                        {
                            errors.password && errors.password.message &&
                            (
                                <View className="my-1">
                                    {
                                        errors.password.message.split(',').map((error: string, index: number) => (
                                            <Text key={index} className="text-red-700">
                                                {error}
                                            </Text>
                                        ))
                                    }
                                </View>
                            )
                        }
                    </View>
                    <View className="flex-1">
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                                validate: () => {
                                    if (errors.confirmPassword) {
                                        return errors.confirmPassword.message;
                                    }
                                    return true;
                                }
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    mode="outlined"
                                    label="Confirm Password"
                                    secureTextEntry={!isConfirmPasswordVisible}
                                    onBlur={onBlur}
                                    onChangeText={(text) => {
                                        handleConfirmPasswordChange(text);
                                    }}
                                    value={value}
                                    error={errors.confirmPassword ? true : false}
                                    right={
                                        <TextInput.Icon
                                            icon={isConfirmPasswordVisible ? "eye" : "eye-off"}
                                            onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} />
                                    }
                                />
                            )}
                            name="confirmPassword"
                        />
                        {
                            errors.confirmPassword && (
                                <Text className="text-red-700 my-1">
                                    {errors.confirmPassword.message}
                                </Text>
                            )
                        }
                    </View>
                </View>

                <Button
                    className="mt-5 py-1 w-3/4 mx-auto"
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                >
                    <Text className="text-lg font-medium">Sign Up</Text>
                </Button>

                <View className="mt-10">
                    <Text className="text-gray-500 text-center text-base font-medium">
                        Already having account?
                    </Text>

                    <View className="flex-row justify-center mt-1">
                        <TouchableHighlight
                            activeOpacity={0.9}
                            underlayColor="#DDDDDD"
                            className="px-2 py-1 rounded-lg"
                            onPress={() => router.navigate("signIn")}
                        >
                            <Text className="text-center text-primary-700 text-base font-medium underline">
                                Sign In
                            </Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}

export default SignUp;