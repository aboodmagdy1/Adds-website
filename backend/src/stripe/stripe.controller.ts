import { Body, Controller, Headers, Post, Req, Res } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { AdPaymentDto } from 'src/ad/dtos/ad-dto';
import { Request } from 'express';
import Stripe from 'stripe';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('stripe')
export class StripeController {
  private stripe: Stripe;

  constructor(private stripeService: StripeService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
  }
  @Post('create-checkout-session')
  @Auth()
  async createCheckoutSession(@Req() req: Request) {
    return this.stripeService.createCheckoutSession(req);
  }

  // https://stackoverflow.com/questions/54346465/access-raw-body-of-stripe-webhook-in-nest-js
  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    try {
      return this.stripeService.handleWebhook(req.rawBody, signature);
    } catch (err) {
      console.log(err.message);
    }
  }
}
