import { useUser } from "@clerk/expo";
import { StripeProvider } from "@stripe/stripe-react-native";
import { Image, Text, View } from "react-native";

//import Payment from "@/components/Payment";


import { icons } from "@/constants";




import PaymentButton from "@/components/payButton";
import React from "react";


  



const Payment = () => {
  
  const { user } = useUser();








  return (

   <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
      merchantIdentifier="merchant.identifier" // required for Apple Pay
      urlScheme="myuber" // required for 3D Secure and bank redirects
    >
      <View className="flex-1 bg-white items-center justify-center px-5">
        <>
          <Text className="text-xl font-JakartaSemiBold mb-3">
            Payment Details
          </Text>

          <View className="flex flex-col w-full items-center justify-center mt-10">
            

            <View className="flex flex-row items-center justify-center mt-5 space-x-2">
              <Text className="text-lg font-JakartaSemiBold">
                {user?.emailAddresses[0]?.emailAddress || ""}
              </Text>

              <View className="flex flex-row items-center space-x-0.5">
                <Image
                  source={icons.star}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
                
              </View>
            </View>
          </View>

          <View className="flex flex-col w-full items-start justify-center py-3 px-5 rounded-3xl bg-general-600 mt-5">
            <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
              <Text className="text-lg font-JakartaRegular">Payment</Text>
              <Text className="text-lg font-JakartaRegular text-[#0CC25F]">
                500
              </Text>
            </View>

            

            
          </View>

         
        <PaymentButton 
        fullName={user?.fullName! } 
        email={user?.emailAddresses?.[0]?.emailAddress || ""}  
         amount={500}
      />
          
        </>
        
      </View>
</StripeProvider>
    
  );
};

export default Payment;