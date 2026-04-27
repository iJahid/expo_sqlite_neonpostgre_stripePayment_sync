import { useAuth } from '@clerk/expo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';




export default function TabLayout() {
const { isSignedIn, isLoaded } = useAuth();
if (!isLoaded) {
  console.log("Not Loaded");
    return null
  }
if (!isSignedIn) {
console.log("Not Sign in......");
    return <Redirect href="/(auth)/sign-in" />
  }

  return (
    <Tabs
      screenOptions={{
       title: 'Home',
        headerShown: false,
        
      }} >
      <Tabs.Screen        name="index"        options={{          title: 'Home',   headerShown: false,   tabBarIcon: () => <Ionicons name="home" size={28}  />        }}      />
     <Tabs.Screen
        name="projects"
        options={{
          title: 'Projects',headerShown: false,

          tabBarIcon: () => <Ionicons name="briefcase" size={28}  /> 
        }}
       />
       <Tabs.Screen
        name="payment"
        options={{
          title: 'Payment',headerShown: false,
           tabBarIcon: () => <Ionicons name="card" size={28}  /> 
        }}
       />
     <Tabs.Screen
        name="profile"
        options={{
          title: 'Settings',headerShown: false,
           tabBarIcon: () => <Ionicons name="settings" size={28}  /> 
        }}
       />
              
    
    </Tabs>
  );
}
