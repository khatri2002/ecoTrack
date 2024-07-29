import { Image, ScrollView, Text, View } from "react-native";
import Logo from "../assets/ecoTrack_logo.png";
import { Button, TextInput } from "react-native-paper";
import { Link } from "expo-router";
import { useForm, Controller, SubmitHandler, set } from "react-hook-form";
import { useEffect } from "react";

type FormData = {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    confirmPassword: string
}

type PasswordValidationErrors = {
    hasLowerCase?: string;
    hasUpperCase?: string;
    hasNumber?: string;
    hasSpecialChar?: string;
    hasLength?: string;
}

const SignUp = () => {

    const {
        control,
        handleSubmit,
        setError,
        setValue,
        clearErrors,
        getValues,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit: SubmitHandler<FormData> = (data) => console.log(data);

    const handlePasswordChange = (password: string) => {
        setValue('password', password);
        let errorMessages: PasswordValidationErrors = {};

        if (!/[a-z]/.test(password)) {
            errorMessages.hasLowerCase = 'Must contain at least one lowercase character';
        }
        if (!/[A-Z]/.test(password)) {
            errorMessages.hasUpperCase = 'Must contain at least one uppercase character';
        }
        if (!/\d/.test(password)) {
            errorMessages.hasNumber = 'Must contain at least one number';
        }
        if (!/[!@#$%^&*]/.test(password)) {
            errorMessages.hasSpecialChar = 'Must contain at least one special character';
        }
        if (password.length < 8) {
            errorMessages.hasLength = 'Must contain at least 8 characters';
        }

        if(Object.keys(errorMessages).length === 0) {
            clearErrors('password');
        }
        else {
            setError('password', {types: errorMessages});
        }
    }

    const handleConfirmPasswordChange = (confirmPassword: string) => { 
        setValue('confirmPassword', confirmPassword);

        if(confirmPassword != getValues('password')) {
            setError('confirmPassword', {message: 'Passwords do not match'});
        }
        else {
            clearErrors('confirmPassword');
        }
    }

    return (
        <>
            <ScrollView className="flex-1 bg-white px-5">
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

                <View className="flex-col gap-y-2">
                    <View className="flex-row gap-x-4">
                        <View className="flex-1">
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                    minLength: 3,
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
                                    minLength: 3,
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
                    <View>
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
                    <View>
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
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    error={errors.phone ? true : false}
                                />
                            )}
                            name="phone"
                        />
                    </View>
                    <View>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
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
                                    />
                                </>
                            )}
                            name="password"
                        />
                        {
                            errors.password && errors.password.types && (
                                Object.values(errors.password.types).map((error, index) => (
                                    <Text key={index} className="text-red-700">
                                        {error}
                                    </Text>
                                ))
                            )
                        }
                    </View>
                    <View>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    mode="outlined"
                                    label="Confirm Password"
                                    onBlur={onBlur}
                                    onChangeText={(text) => {
                                        handleConfirmPasswordChange(text);
                                    }}
                                    value={value}
                                    error={errors.confirmPassword ? true : false}
                                />
                            )}
                            name="confirmPassword"
                        />
                        {
                            errors.confirmPassword && (
                                <Text className="text-red-700">
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
                    <Link href="/signIn">
                        <Text className="text-center text-primary-700 text-base font-medium underline mt-1">
                            Sign In
                        </Text>
                    </Link>
                </View>
            </ScrollView>
        </>
    );
}

export default SignUp;