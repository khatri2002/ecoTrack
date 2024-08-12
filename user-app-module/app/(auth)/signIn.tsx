import { Image, Text, TouchableHighlight, View } from "react-native";
import Logo from "../../assets/ecoTrack_logo.png";
import { Button, TextInput } from "react-native-paper";
import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { signInPassword } from "../lib/api";
import { isCustomError } from "../lib/utils";
import ErrorDialog from "../components/ErrorDialog";
import { useAuthContext } from "../context/AuthProvider";

type FormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const router = useRouter();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorDialog, setErrorDialog] = useState({
    visible: false,
    title: "",
    description: "",
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const {userIn} = useAuthContext();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setLoading(true);
      const response = await signInPassword(data);
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
      <View className="flex-1 flex flex-col bg-white justify-between px-5 pb-5">
        <View className="w-full">
          <Image source={Logo} className="w-44 h-44 mt-8 mx-auto" />

          <View className="my-5">
            <Text className="text-center text-3xl font-semibold">Welcome!</Text>
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
                    // right={
                    //     <TextInput.Icon icon="email" style={{ pointerEvents: "none" }} />
                    // }
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
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    mode="outlined"
                    label="Password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.password ? true : false}
                    // right={
                    //     <TextInput.Icon
                    //         icon={isPasswordVisible ? "eye" : "eye-off"}
                    //         onPress={() => setIsPasswordVisible(!isPasswordVisible)} />
                    // }
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
            loading={loading}
            disabled={loading}
          >
            <Text className="text-lg font-medium">Sign In</Text>
          </Button>

          <View className="flex-row justify-center mt-3">
            <TouchableHighlight
              activeOpacity={0.9}
              underlayColor="#DDDDDD"
              className="py-1 px-2 rounded-lg"
              onPress={() => router.navigate("otp_SignIn")}
            >
              <Text className="text-center text-primary-700 text-base font-medium">
                Sign In using OTP
              </Text>
            </TouchableHighlight>
          </View>
        </View>

        <View>
          <Text className="text-gray-500 text-center text-base font-medium">
            New to ecoTrack?
          </Text>
          <View className="flex-row justify-center mt-1">
            <TouchableHighlight
              activeOpacity={0.9}
              underlayColor="#DDDDDD"
              className="px-2 py-1 rounded-lg"
              onPress={() => router.navigate("signUp")}
            >
              <Text className="text-center text-primary-700 text-base font-medium underline">
                Create an account
              </Text>
            </TouchableHighlight>
          </View>
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

export default SignIn;
