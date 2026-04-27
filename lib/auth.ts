import { fetchAPI } from '@/lib/fetch';
import * as Linking from 'expo-linking';

export const googleOAuth = async(startOAuthFlow:any) => {
    try{
     // Initiate OAuth flow with deep link redirect
      const { createdSessionId, setActive,signUp } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/(root)/(tabs)/home'),
      });

      if (createdSessionId) {
        if(setActive){
          await setActive({ session: createdSessionId });

          if(signUp?.createdUserId){
            await fetchAPI('/(api)/user', {
              method: 'POST',
              body: JSON.stringify({
                name:`${signUp?.firstName || 'User'} ${signUp?.lastName || ''}`,
                email: signUp?.emailAddress,
                clerkid: signUp?.createdUserId,
              }),
            });
          }

          return {
            success: true,
            code: 'success',
            message: 'Logged in successfully',
          }
        }

      }

         return {
            success: false,
            code: 'failed',
            message: 'Login failed',
          }
        } catch (err:any) {
      console.error('Auth error', err);
       return {
            success: false,
            code: 'failed',
            message: `Login error ${err?.errors[0]?.longMessage || 'Unknown error'}`,
          }
    }
  
}

export default googleOAuth