import { Redirect, router } from 'expo-router';
import { useAuthContext } from './context/AuthProvider';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const index = () => {

    const {loading, loggedIn} = useAuthContext();

    if(loading) {
        return (
            <View className="bg-white flex-1">
                <ActivityIndicator className="absolute inset-x-1/2 inset-y-1/2" size={35} />
            </View>
        );
    }

    if(loggedIn) {
        return <Redirect href={'/home'} />;
    }
    else {
        return <Redirect href={'/signIn'} />;
    }

}

export default index;