import CustomButton from '@/components/customButton';
import { useAuth, useUser } from '@clerk/expo';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
  const { user } = useUser();
const { signOut } = useAuth();

  return (
    <SafeAreaView className='flex-1 justify-center items-center gap-4'>
    <View>
      <Text>Profile</Text>
      <Text className='text-3xl text-blue-500'>Hello {user?.firstName || ""} {user?.lastName || ""}</Text>
            <Text className='text-lg text-cool-gray-600'> {user?.emailAddresses[0]?.emailAddress || ""}</Text>
          
      <CustomButton title='Sign Out' onPress={()=>{signOut()}} />
    </View>
    </SafeAreaView>
  )
}

export default Profile