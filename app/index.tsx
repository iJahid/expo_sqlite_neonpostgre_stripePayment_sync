import { Text, View } from 'react-native';



import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

// ... inside your component
 
export default function HomeScreen() {
 
    
  //verifyInstallation();
  return (
   <SafeAreaView className='flex-1 justify-center items-center gap-4' >
    <View className="flex-1 justify-center items-center gap-4">
      <Text className="text-2xl font-bold text-cool-gray-800">Welcome </Text>
      
    </View>
   </SafeAreaView>
  );
}

