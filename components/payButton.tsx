import CustomButton from '@/components/customButton';
import { images } from '@/constants';
import { initDB } from '@/lib/db';
import { fetchAPI } from '@/lib/fetch';
import { fullSync } from '@/lib/fullSync';
import { usePaymentsStore } from '@/store/usePaymentsStore';
import { PaymentProps } from '@/types/types';
import { useUser } from '@clerk/expo';
import { useStripe } from '@stripe/stripe-react-native';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Text, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';

const PaymentButton = ({fullName, email, amount }:PaymentProps ) => {

     const { initPaymentSheet, presentPaymentSheet } = useStripe();
     const {user}=useUser();
    const [success,setSuccess]=useState(false);
   
    const {  addPayment } = usePaymentsStore();
   
   useEffect(() => {
       initDB()
       
     }, [user])
   
  
  const initializePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: "JITSoft",
      intentConfiguration: {
        mode: {
          amount:amount*100,
          currencyCode: "USD",
        },
        confirmHandler:
          async (
          paymentMethod,
          _,
          intentCreationCallback,
        ) => {

         const {paymentIntent,  customer} = await fetchAPI('/(api)/(stripe)/create', 
          {
            method: 'POST',
            headers: {  'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: fullName ||email?.split('@')[0] ,
            email: email,
            amount: amount,
          paymentMethodId: paymentMethod.id,}
          )});
            
          Alert.alert(paymentIntent.client_secret);
         if(paymentIntent.client_secret){
        const {result}=  await fetchAPI('/(api)/(stripe)/pay',
          {
            method: 'POST',
            headers: {  'Content-Type': 'application/json' },
          body: JSON.stringify({
            payment_method_id: paymentMethod.id,
            payment_intent_id: paymentIntent.id,
            customer_id: customer,
          })}
          );
          
            Alert.alert(result.client_secret);
          if(result.client_secret)
          {
         

              //insert into db
              addPayment(user?.id!, fullName, email, amount);
              fullSync(user?.id!);
             intentCreationCallback({clientSecret: result.client_secret});
          }

         }
         else{
          Alert.alert('payment Failed to create payment intent');
         }

      /*   const {client_secret,error} = await response.json();
         if(client_secret)
         {
          intentCreationCallback({clientSecret: client_secret});//, ephemeralKeySecret: ephemeralKey.secret, customerId: customer});

         }
         else{
                intentCreationCallback({error});
         }*/
         
           
}
      },
      returnURL: 'myapp:"//Payment"',
     
    });
    if(error)
    {
     Alert.alert(`initializePaymentSheet Error iine 104: ${error.code} ${error.message}`);
    }

 };


  const openPaymentSheet=async()=>{
    await initializePaymentSheet();
    const {error} =await presentPaymentSheet();
    if(error)
      {
        Alert.alert(`118 Error : ${error.code} ${error.message}`);

      }
      else
      {
        setSuccess(true);
      }
    
  };  



return (
  <>
  <CustomButton title='Confirm Payment'
  onPress={openPaymentSheet}
  className='my-10'/>

  <ReactNativeModal isVisible={success}
onBackdropPress={()=>setSuccess(false)}
>
  <View className= ' flex flex-col bg-white p-5 rounded-lg items-center justify-center'>

<Image source={images.check} className='w-20 h-20 mb-5'/> 
<Text className='text-lg font-semibold mb-2'>Payment Successful!</Text>
  
  <CustomButton title='Close' onPress={()=>{setSuccess(false); router.push('/(tabs)')}} className='bg-blue-500 w-full mt-5'/> 
  </View>

  </ReactNativeModal>
  </>
)

  }

export default PaymentButton