import { Text, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Button } from "react-native-paper";

const ReportCleanupSuccess = () => {
    return (
        <>
            <View className="flex-1 bg-white flex-col justify-center items-center p-3 gap-y-5 relative">
                <AntDesign name="checkcircleo" size={120} color="green" />
                <Text className="font-semibold text-xl text-center">
                    Your report has been submitted successfully!
                </Text>
                <Text className="text-center text-slate-600">
                    Status of your report can be tracked in your profile.
                </Text>
                <Button mode="contained" className="absolute bottom-14" onPress={() => {
                    // redirect to profile screen
                }}>
                    <Text className="text-base">
                        Go to Profile
                    </Text>
                </Button>
            </View>
        </>
    );
}

export default ReportCleanupSuccess;