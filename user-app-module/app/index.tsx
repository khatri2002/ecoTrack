import { Redirect } from 'expo-router';

const index = () => {
    return <Redirect href="/signIn" />;
    // return <Redirect href="/verify-otp/signUp" />;
}

export default index;