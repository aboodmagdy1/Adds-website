import { Body, Controller, Header, Headers, Post, Req } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { AdPaymentDto } from 'src/ad/dtos/ad-dto';
import { Request } from 'express';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}
  @Post('create-checkout-session')
  async createCheckoutSession(@Body() Body: AdPaymentDto, @Req() req: Request) {
    return this.stripeService.createCheckoutSession(Body, req);
  }
}
