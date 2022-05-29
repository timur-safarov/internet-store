
import Stripe from 'stripe';

const stripeConfig = new Stripe(process.env.STRIPE_SECRET || '', {
  //При вводе слова apiVersion можно перейти на этот слово и увидеть нужную дату,
  //которую нужно указать с права
  apiVersion: '2020-08-27',
});

export default stripeConfig;