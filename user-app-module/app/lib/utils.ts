import * as Location from "expo-location";

type CustomError = {
  response: {
    data: {
      status: boolean;
      type: string;
      title: string;
      message: string;
    };
  };
};

export const isCustomError = (error: unknown): error is CustomError => {
  return typeof error === "object" && error != null && "response" in error;
};

export const getLocation = async () => {
  try {
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=geocodejson&lat=${latitude}&lon=${longitude}`,
    );
    const resJson = await response.json();

    // include coordinates fetched using the device's GPS in the response
    const coordinates = {
      latitude,
      longitude,
    };
    resJson.coordinates = coordinates;
    
    return resJson;
  } catch (error) {
    throw error;
  }
};
