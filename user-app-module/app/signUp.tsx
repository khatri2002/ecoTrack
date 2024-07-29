import { Image, ScrollView, Text, View } from "react-native";
import Logo from "../assets/ecoTrack_logo.png";
import { Button, TextInput } from "react-native-paper";
import { Link } from "expo-router";

const SignUp = () => {
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
                    <View className="flex-row gap-4">
                        <TextInput
                            className="flex-1"
                            mode="outlined"
                            label="First Name"
                        />
                        <TextInput
                            className="flex-1"
                            mode="outlined"
                            label="Last Name"
                        />
                    </View>
                    <TextInput
                        mode="outlined"
                        label="Email"
                    />
                    <TextInput
                        mode="outlined"
                        label="Phone"
                    />
                    <TextInput
                        mode="outlined"
                        label="Create Password"
                    />
                    <TextInput
                        mode="outlined"
                        label="Confirm Password"
                    />
                </View>

                <Button
                    className="mt-5 py-1 w-3/4 mx-auto"
                    mode="contained"
                    onPress={() => { }}>
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