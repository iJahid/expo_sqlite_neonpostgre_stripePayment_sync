import { icons } from '@/constants';
import googleOAuth from '@/lib/auth';
import { useOAuth } from '@clerk/expo';
import { router } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';
import CustomButton from './customButton';
function OAuth() {

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const handleGoogleLogin = React.useCallback(async () => {
    try {
     const result = await googleOAuth(startOAuthFlow);
      if (result.code === "session_exists"  || result.code === "success") {
      
      router.replace("/(tabs)");
    }

    


     

    } catch (err:any) {
      console.error('OAuth error', err);
      
    }
  }, []);


  return (
    <View>
        <View className='flex flex-row justify-center items-center mt-4 gap-x-3'>
            <View className='flex-1 h-[1px] bg-general-100'/>
            <Text className='text-lg'>Or</Text>
            <View className='flex-1 h-[1px] bg-general-100'/>

        </View>
        <CustomButton title='Log in with Google'
        bgVariant='outline'
        textVariant='primary'
        className='mt-5  w-full shadow-none'
        onPress={handleGoogleLogin}
        IconLeft={()=>(<Image source={icons.google} className='w-5 h-5 mx-2' resizeMode='contain'/>)}/>
    </View>
  )
}

export default OAuth