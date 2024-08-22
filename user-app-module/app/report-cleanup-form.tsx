import { Appbar, Button, TextInput, HelperText } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

import { ScrollView, Text, View } from "react-native";
import PhotosModal from "./components/PhotosModal";
import { useEffect, useRef, useState } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import CustomSnackbar from "./components/CustomSnackbar";
import { getLocation } from "./lib/utils";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useAuthContext } from "./context/AuthProvider";
import { router } from "expo-router";
import LoadingDialog from "./components/LoadingDialog";
import { submitReport } from "./lib/api";
import * as FileSystem from "expo-file-system";
import ErrorDialog from "./components/ErrorDialog";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type FormData = {
  name: string;
  email: string;
  phone: string;
  title: string;
  description: string;
  city: string;
  state: string;
  address: string;
  additionalAddress: string;
  postalCode: string;
};

type MediaError = {
  photos: boolean;
  video: boolean;
};

const ReportCleanupForm = () => {
  const { user } = useAuthContext();

  const [loading, setLoading] = useState({
    show: false,
    text: "",
  });
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const [mediaError, setMediaError] = useState<MediaError>({
    photos: false,
    video: false,
  });
  const [showError, setShowError] = useState(false);

  const [showAdditionalAddress, setShowAdditionalAddress] = useState(false);

  const [isPhotosModalVisible, setPhotosModalVisible] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  const [video, setVideo] = useState<string | null>(null);
  const [removedVideo, setRemovedVideo] = useState<string | null>(null);
  const [removedVideoMsg, setRemovedMsg] = useState<boolean>(false);

  const [accurateCoordinates, setAccurateCoordinates] =
    useState<Coordinates | null>(null);
  const [apiCoordinates, setApiCoordinates] = useState<Coordinates | null>(
    null,
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    let ignore = false;
    setLoading({
      show: true,
      text: "Getting your current location...",
    });

    if (!user) {
      router.replace("signIn");
      return;
    }

    // set contact details
    setValue("name", user.name);
    setValue("email", user.email);
    setValue("phone", user.phone);

    // get and set location
    getLocation()
      .then((location) => {
        if (!ignore) {
          setAccurateCoordinates(location.coordinates);
          // accurate coordinates are fetched using the device's GPS

          setApiCoordinates({
            latitude: location.features[0].geometry.coordinates[1],
            longitude: location.features[0].geometry.coordinates[0],
          });
          // api coordinates are fetched using the OpenStreetMap API

          setValue("city", location.features[0].properties.geocoding.city);
          setValue("state", location.features[0].properties.geocoding.state);
          setValue("address", location.features[0].properties.geocoding.label);
          setValue(
            "postalCode",
            location.features[0].properties.geocoding.postcode,
          );
        }
      })
      .catch((error) => {
        // TODO: show error
        console.error(error);
      })
      .finally(() => {
        setLoading({
          show: false,
          text: "",
        });
      });
    return () => {
      ignore = true;
    };
  }, []);

  const ref = useRef(null);
  const player = useVideoPlayer(video, (player) => {
    if (video) {
      player.loop = true;
      player.play();
    }
  });

  const handleSetPhotos = (newPhotos: string[]) => {
    setPhotos(newPhotos);
  };

  const renderCapturedPhotosMsg = () => {
    switch (photos.length) {
      case 0:
        return "No photos captured";
      case 1:
        return "1 photo captured";
      default:
        return `${photos.length} photos captured`;
    }
  };

  const renderVideCapturedMsg = () => {
    return video ? "Video captured" : "No video captured";
  };

  const handleCaptureVideo = async () => {
    if (mediaError.video) {
      setMediaError({ ...mediaError, video: false });
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });
    if (!result.canceled) {
      // if mov, rename to mp4
      if (result.assets[0].uri.split(".").pop() === "mov") {
        let newUri = result.assets[0].uri.replace(/mov$/, "mp4");
        await FileSystem.moveAsync({
          from: result.assets[0].uri,
          to: newUri,
        });
        result.assets[0].uri = newUri;
      }
      setVideo(result.assets[0].uri);
    }
  };

  const handleRemoveVideo = () => {
    setRemovedVideo(video);
    setVideo(null);
    setRemovedMsg(true);
  };

  const handleUndoRemovedVideo = () => {
    if (removedVideo) {
      setVideo(removedVideo);
      setRemovedVideo(null);
      setRemovedMsg(false);
    }
  };

  const handleErrors = (errors: any) => {
    let mediaError = {
      photos: false,
      video: false,
    };
    if (photos.length === 0) {
      mediaError.photos = true;
    }
    if (!video) {
      mediaError.video = true;
    }
    setMediaError(mediaError);
    setErrorSnackbar(true);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    let mediaError = {
      photos: false,
      video: false,
    };
    if (photos.length === 0) {
      mediaError.photos = true;
    }
    if (!video) {
      mediaError.video = true;
    }
    if (mediaError.photos || mediaError.video) {
      setMediaError(mediaError);
      setErrorSnackbar(true);
      return;
    }

    setLoading({
      show: true,
      text: "Submitting report...",
    });

    // prepare data
    const _data = {
      title: data.title,
      description: data.description,
      location: {
        city: data.city,
        state: data.state,
        address: data.address,
        postal_code: data.postalCode,
        additional_address: data.additionalAddress,
        accurate_coordinates: accurateCoordinates,
        api_coordinates: apiCoordinates,
      },
    };

    // prepare formData
    const formData = new FormData();
    formData.append("data", JSON.stringify(_data));
    photos.forEach((photo) => {
      formData.append("photos", {
        uri: photo,
        name: photo.split("/").pop(),
        type: "image/jpeg",
      });
    });
    formData.append("video", {
      uri: video,
      name: video!.split("/").pop(),
      type: "video/mp4",
    });

    try {
      const response = await submitReport(formData);
      if (response.status) {
        router.replace("report-cleanup-success");
      }
    } catch (error) {
      setShowError(true);
    } finally {
      setLoading({
        show: false,
        text: "",
      });
    }
  };

  return (
    <>
      <View className="flex-1 bg-white">
        <Appbar.Header className="bg-white" statusBarHeight={0} elevated={true}>
          <Appbar.BackAction onPress={() => {}} />
          <Appbar.Content title="Report Cleanup" />
        </Appbar.Header>

        <ScrollView className="px-3">
          <View className="mt-12 flex-1">
            <View className="flex-col gap-y-6 rounded-lg bg-slate-200 p-3">
              <View className="relative flex-col gap-y-2 rounded-lg bg-white px-3 pb-5 pt-5">
                <View className="absolute -top-4 left-5 rounded-lg bg-primary-800">
                  <Text className="px-3 text-sm font-semibold text-white">
                    Contact Details
                  </Text>
                </View>
                <View>
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        mode="flat"
                        label="Name"
                        value={value}
                        disabled={true}
                      />
                    )}
                    name="name"
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
                        mode="flat"
                        label="Email"
                        value={value}
                        disabled={true}
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
                        mode="flat"
                        label="Phone"
                        value={value}
                        disabled={true}
                      />
                    )}
                    name="phone"
                  />
                </View>
              </View>

              <View className="relative flex-col gap-y-2 rounded-lg bg-white px-3 pb-5 pt-5">
                <View className="absolute -top-4 left-5 rounded-lg bg-primary-800">
                  <Text className="px-3 text-sm font-semibold text-white">
                    Spot Details
                  </Text>
                </View>
                <View>
                  <Controller
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Title is required",
                      },
                      minLength: {
                        value: 5,
                        message: "Minimum 5 characters required",
                      },
                      maxLength: {
                        value: 100,
                        message: "Maximum 100 characters allowed",
                      },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        mode="flat"
                        label="Title"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.title ? true : false}
                      />
                    )}
                    name="title"
                  />
                  {errors.title && (
                    <HelperText type="error">{errors.title.message}</HelperText>
                  )}
                </View>
                <View>
                  <Controller
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Description is required",
                      },
                      minLength: {
                        value: 10,
                        message: "Minimum 10 characters required",
                      },
                      maxLength: {
                        value: 500,
                        message: "Maximum 500 characters allowed",
                      },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        mode="flat"
                        label="Description"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        multiline={true}
                        error={errors.description ? true : false}
                      />
                    )}
                    name="description"
                  />
                  {errors.description && (
                    <HelperText type="error">
                      {errors.description.message}
                    </HelperText>
                  )}
                </View>
              </View>

              <View className="relative flex-col gap-y-2 rounded-lg bg-white px-3 pb-5 pt-5">
                <View className="absolute -top-4 left-5 rounded-lg bg-primary-800">
                  <Text className="px-3 text-sm font-semibold text-white">
                    Location Details
                  </Text>
                </View>
                <View>
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        mode="flat"
                        label="City"
                        value={value}
                        disabled={true}
                      />
                    )}
                    name="city"
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
                        mode="flat"
                        label="State"
                        value={value}
                        disabled={true}
                      />
                    )}
                    name="state"
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
                        mode="flat"
                        label="Address"
                        multiline={true}
                        value={value}
                        disabled={true}
                      />
                    )}
                    name="address"
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
                        mode="flat"
                        label="Postal Code"
                        value={value}
                        disabled={true}
                      />
                    )}
                    name="postalCode"
                  />
                </View>
                {showAdditionalAddress ? (
                  <View>
                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          mode="flat"
                          label="Additional Address Details"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          multiline={true}
                          value={value}
                        />
                      )}
                      name="additionalAddress"
                    />
                    <View className="flex-row items-center">
                      <Button
                        onPress={() => {
                          setValue("additionalAddress", "");
                          setShowAdditionalAddress(false);
                        }}
                      >
                        <Text className="text-red-600">Remove</Text>
                      </Button>
                      <Text className="font-medium">
                        additional address details
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View className="flex-row items-center">
                    <Button onPress={() => setShowAdditionalAddress(true)}>
                      Click
                    </Button>
                    <Text className="font-medium">
                      to add additional address details
                    </Text>
                  </View>
                )}
              </View>

              <View
                className={`relative flex-col gap-y-2 rounded-lg bg-white px-3 pb-5 pt-5 ${mediaError.photos ? "border-2 border-red-600" : ""}`}
              >
                <View className="absolute -top-4 left-5 rounded-lg bg-primary-800">
                  <Text className="px-3 text-sm font-semibold text-white">
                    Photos
                  </Text>
                </View>
                <Button
                  mode="contained"
                  onPress={() => {
                    setMediaError({ ...mediaError, photos: false });
                    setPhotosModalVisible(true);
                  }}
                >
                  Capture Photos
                </Button>
                {!mediaError.photos ? (
                  <Text className="text-center text-slate-500">
                    {renderCapturedPhotosMsg()}
                  </Text>
                ) : (
                  <Text className="text-center text-red-600">
                    At least 1 photo is required
                  </Text>
                )}
              </View>

              <View
                className={`relative flex-col gap-y-2 rounded-lg bg-white px-3 pb-5 pt-5 ${mediaError.video ? "border-2 border-red-600" : ""}`}
              >
                <View className="absolute -top-4 left-5 rounded-lg bg-primary-800">
                  <Text className="px-3 text-sm font-semibold text-white">
                    Video
                  </Text>
                </View>
                {!video ? (
                  <Button mode="contained" onPress={handleCaptureVideo}>
                    Capture Video
                  </Button>
                ) : (
                  <VideoView
                    ref={ref}
                    className="w-100 mt-2 h-48 rounded-lg"
                    player={player}
                    allowsFullscreen
                    allowsPictureInPicture
                  />
                )}
                {!mediaError.video ? (
                  <Text className="mt-2 text-center text-slate-500">
                    {renderVideCapturedMsg()}
                  </Text>
                ) : (
                  <Text className="mt-2 text-center text-red-600">
                    Video is required
                  </Text>
                )}
                {video && (
                  <View className="flex-row justify-center">
                    <Button onPress={handleCaptureVideo}>Retake</Button>
                    <Button onPress={handleRemoveVideo}>
                      <Text className="text-red-600">Remove</Text>
                    </Button>
                  </View>
                )}
              </View>

              <View className="relative flex-col gap-y-2 rounded-lg bg-white px-3 pb-5 pt-5">
                <Button
                  onPress={handleSubmit(onSubmit, (errors) => {
                    handleErrors(errors);
                  })}
                  icon="send"
                  mode="contained"
                  contentStyle={{ flexDirection: "row-reverse" }}
                >
                  <Text className="text-lg font-semibold">Submit</Text>
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      <PhotosModal
        visible={isPhotosModalVisible}
        handleClose={() => setPhotosModalVisible(false)}
        photos={photos}
        handleSetPhotos={handleSetPhotos}
      />

      <CustomSnackbar
        visible={removedVideoMsg}
        onDismiss={() => setRemovedMsg(false)}
        action={{
          label: "Undo",
          onPress: handleUndoRemovedVideo,
        }}
        position="top"
        text="Video Removed"
      />

      <CustomSnackbar
        visible={errorSnackbar}
        onDismiss={() => setErrorSnackbar(false)}
        varient="error"
        position="top"
        text="Please Provide Valid Information"
      />

      <ErrorDialog
        visible={showError}
        description="Something went wrong. Please try again later."
        title="Error Submitting Report"
        onDismiss={() => setShowError(false)}
      />

      <LoadingDialog visible={loading.show} text={loading.text} />
    </>
  );
};

export default ReportCleanupForm;
