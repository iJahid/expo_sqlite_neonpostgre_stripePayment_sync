import Stripe from 'stripe';
const stripe = new Stripe(process.env.EXPO_PUBLIC_STRIPE_SECRET_KEY!);

export async function POST(request: Request)
    {
        const body = await request.json();
        const {name, email, amount} = body;
        if(!name || !email || !amount)
        {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              });
        }

        let customer;
        const doesCustomerExist = await stripe.customers.list({email: email});
        if(doesCustomerExist.data.length > 0)
        {
            customer = doesCustomerExist.data[0];
        }
        else
        {
            customer = await stripe.customers.create({
                name: name,
                email: email
            });
        }
        
        const ephemeralKey = await stripe.ephemeralKeys.create(
            {customer: customer.id},
            {apiVersion: '2022-11-15'}
        );
        const paymentIntent = await stripe.paymentIntents.create({
    amount: parseInt(amount)*100,
    currency: 'usd',
    customer: customer.id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter
    // is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: 'never',
    },
  });

  return new Response(JSON.stringify({
    paymentIntent: paymentIntent,
    ephemeralKey: ephemeralKey,
    
    customer: customer.id,
    }), 
);
 


    }