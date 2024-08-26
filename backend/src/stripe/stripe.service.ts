import { Injectable } from '@nestjs/common';
import { AdPaymentDto } from 'src/ad/dtos/ad-dto';
import Stripe from 'stripe';
@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
  }

  async createCheckoutSession(bodyData: AdPaymentDto) {
    const base_url =
      process.env.NODE_ENV === 'production'
        ? process.env.CLIENT_BASE_URL_PROD
        : process.env.CLIENT_BASE_URL_DEV;
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'egp',
            product_data: {
              name: bodyData.title,
              images: [bodyData.imgUrls[0]],
            },
            unit_amount: bodyData.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${base_url}/success.html`,
      cancel_url: `${base_url}/cancel.html`,
      metadata: {
        adId: bodyData._id,
        ownerId: bodyData.owner,
      },
    });

    return { url: session.url };
  }
}
