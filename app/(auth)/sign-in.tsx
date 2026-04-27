
import CustomButton from '@/components/customButton'
import InputField from '@/components/inputField'
import OAuth from '@/components/OAuth'
import { icons, images } from '@/constants'
import { useAuth, useSignIn } from '@clerk/expo'
import { Link, useRouter } from 'expo-router'
import React from 'react'
import { Alert, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native'

const SignIn = () => {
   const { isSignedIn, isLoaded } = useAuth();
   const { signIn,fetchStatus ,errors  } = useSignIn()
     const router = useRouter()
    const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [code, setCode] = React.useState('')
  

  const handleSubmit = async () => {
    const { error } = await signIn.password({
      emailAddress,
      password,
    })
    if (error) {
      Alert.alert('Error', error.message);
      console.error(JSON.stringify(error, null, 2))
      return
    }

    if (signIn.status === 'complete') {
      await signIn.finalize({
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
            router.push("/(tabs)")
          }
        },
      })
    } else if (signIn.status === 'needs_second_factor') {
      // See https://clerk.com/docs/guides/development/custom-flows/authentication/multi-factor-authentication
    } else if (signIn.status === 'needs_client_trust') {
      // For other second factor strategies,
      // see https://clerk.com/docs/guides/development/custom-flows/authentication/client-trust
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === 'email_code',
      )

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode()
      }
    } else {
      // Check why the sign-in is not complete
      Alert.alert('Error', 'Sign-in attempt not complete. Please try again.');
      console.error('Sign-in attempt not complete:', signIn)
    }
  }



const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code })

    if (signIn.status === 'complete') {
      await signIn.finalize({
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
            router.push("./(tabs)/")
          }
        },
      })
    } else {
      // Check why the sign-in is not complete
      Alert.alert('Error', 'Verification failed. Please try again.');
      console.error('Sign-in attempt not complete:', signIn)
    }
  }


 if (signIn.status === 'needs_client_trust') {
    return (
      <View > 
        <Text>
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
          
          onPress={() => signIn.mfa.sendEmailCode()}
        >
          <Text >I need a new code</Text>
        </Pressable>
        <Pressable
          
          onPress={() => signIn.reset()}
        >
          <Text >Start over</Text>
        </Pressable>
      </View>
    )
  }





  return (
    <ScrollView className='flex-1 bg-white'>
    <View className='flex-1 bg-white'>
      <View className='relative w-full h-[250px]'>

      <Image source={images.message} className='z-0  w-full h-[250px]'/>
      <Text className='text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5'>
        Welcome 👏</Text>

      </View>
      <View className='p-5'>
        


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

        <CustomButton title='Sign In' onPress={()=>{handleSubmit()}} className='mt-6'/>
          <OAuth />
          <Link href="/sign-up" className='text-lg text-general-200 mt-10 text-center'>
          <Text>Don't have an account?</Text>
          <Text className='text-primary-500'>Sign Up</Text>
          
          </Link>

      </View>
    </View>
    </ScrollView>
  )
}

export default SignIn;