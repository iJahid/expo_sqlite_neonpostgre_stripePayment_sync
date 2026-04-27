import CustomButton from '@/components/customButton';
import InputField from '@/components/inputField';
import OAuth from '@/components/OAuth';
import { icons, images } from '@/constants';
import { useAuth, useSignUp } from '@clerk/expo';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { ReactNativeModal } from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignUp = () => {

  const {signUp ,errors, fetchStatus } = useSignUp()
   const { isSignedIn } = useAuth()
 const [showSuccessModal ,setShowSuccessModal]= useState(false);
const [verification,setVerification]=useState({
  state:'default',
  error:'',
  code:''
 })
 const [userName,setUserName] = React.useState('')
 const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [code, setCode] = React.useState('')
  const [pendingVerification, setPendingVerification] = useState(false);



  const handleSubmit = async () => {
    const { error } = await signUp.password({
      emailAddress,
      password,
    })
    if (error) {
      Alert.alert('Error', error.message);
      console.error(JSON.stringify(error, null, 2))
      return
    }

    if (!error) 
      { 
        await signUp.verifications.sendEmailCode();
         setPendingVerification(true);
    }
  }


const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code,   })
      if (signUp.status === 'complete') {
        await signUp.finalize({
          // Redirect the user to the home page after signing up
          navigate: ({ session, decorateUrl }) => {
            // Handle session tasks
            // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
            if (session?.currentTask) {
              console.log(session?.currentTask)
              return
            }

            // If no session tasks, navigate the signed-in user to the home page
            const url = decorateUrl('/')
            if (url.startsWith('http')) {
              window.location.href = url
            } else {
              setPendingVerification(false);
              router.push("/(tabs)")
            }
          },
        })
      } else {
        // Check why the sign-up is not complete
        Alert.alert('Error', 'Verification failed. Please try again.');
        console.error('Sign-up attempt not complete:', signUp)
      }
  }



  if (signUp.status === 'complete' || isSignedIn) {
    return null
  }

  if (
    signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields.includes('email_address') &&
    signUp.missingFields.length === 0 && pendingVerification==true
  ) {
    return (
      <SafeAreaView className='flex-1 justify-center items-center gap-4'>
        <Text className='text-2xl font-bold text-cool-gray-800'>
          Verify your account
        </Text>
        <TextInput
          
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor="#666666"
          onChangeText={(code) => setCode(code)}
          keyboardType="numeric"
        />
        {errors.fields.code && (
          <Text >{errors.fields.code.message}</Text>
        )}
        <Pressable
          onPress={handleVerify}
          disabled={fetchStatus === 'fetching'}
        >
          <Text >Verify</Text>
        </Pressable>
        <Pressable
          
          onPress={() => signUp.verifications.sendEmailCode()}
        >
          <Text >I need a new code</Text>
        </Pressable>
        <Pressable
          
          onPress={() => {
            setPendingVerification(false);
    setCode('');
            //router.push("/(auth)/sign-up") 
            }

            }
        >
          <Text >Re-enter email</Text>
        </Pressable>
      </SafeAreaView>
    )
  }
  
  return (
  
    <ScrollView className='flex-1 bg-white'>
    <View className='flex-1 bg-white'>
      <View className='relative w-full h-[250px]'>

      <Image source={images.message} className='z-0  w-full h-[250px]'/>
      <Text className='text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5'>Create Your Account</Text>

      </View>
      <View className='p-5'>
        <InputField label="Name" 
        icon={icons.person}
        placeholder="Enter Your Name"
        value={userName}
        onChangeText={(value)=>setUserName(value)}>
        </InputField>


      <InputField label="Email" 
        icon={icons.email}
        placeholder="Enter Your Email"
        value={emailAddress}
        onChangeText={(value)=>setEmailAddress(value)}>
        </InputField>
         
         <InputField label="Password" 
        icon={icons.lock}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={(value)=>setPassword(value)}>
        </InputField>

        <CustomButton title='Sign Up' onPress={()=>{handleSubmit()}} className='mt-6'/>
          <OAuth/>
          <Link href="/sign-in" className='text-lg text-general-200 mt-10 text-center'>
          <Text>Already have an account?</Text>
          <Text className='text-primary-500'> Log In</Text>
          
          </Link>

      </View>

        {/*modal*/}
 



        <ReactNativeModal isVisible={showSuccessModal}>
          <View className='bg-white px-7 py-7 rounded-2xl min-h-[300px]'>
            <Image source={images.check} className='w-[110px] h-[110px] mx-auto my-5'/>
            <Text className='text-3xl font-JakartaBold text-center'>Verified</Text>
            <Text className='text-base text-gray-400 font-Jakarta text-center'>
              You have successfully vrified your account</Text>
            <CustomButton title='Start Using' onPress={()=>router.replace('/(tabs)')}
              className='mt-5'/>
          </View>

        </ReactNativeModal>
    </View>
    </ScrollView>
  )
  
}

export default SignUp