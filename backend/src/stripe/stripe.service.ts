import { Injectable } from '@nestjs/common';
import { Request } from 'express';
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

  async createCheckoutSession(req: Request) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: 'price_1Prby4B7xuh8j3Y0teHGL0Z5',
          quantity: 1,
        },
      ],
      success_url: `${req.protocol}://${req.get('host')}/success.html`,
      cancel_url: `${req.protocol}://${req.get('host')}/cancel.html`,
      metadata: {
        userId: req.user as string,
      },
    });

    return { url: session.url };
  }
}
