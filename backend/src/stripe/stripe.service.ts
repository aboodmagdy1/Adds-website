import { BadRequestException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AdPaymentDto } from 'src/ad/dtos/ad-dto';
import { Role } from 'src/auth/decorators/roles.decorator';
import { UsersService } from 'src/users/users.service';
import { EmailParams, EmailService } from 'src/utils/email/email.service';
import Stripe from 'stripe';
@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(
    private userService: UsersService,
    private emailService: EmailService,
  ) {
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
    });

    return { url: session.url };
  }

  async handleWebhook(body: Buffer, signature: string) {
    let event: Stripe.Event;
    try {
      // verify the signature
      event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.WEBHOOK_SECRET,
      );
    } catch (err) {
      throw new BadRequestException('Webhook Error: ', err.message);
    }

    // Handle the event
    switch (event.type) {
      case 'invoice.payment_succeeded':
        await this.handleSubscriptionPaymentSucceeded(
          event.data.object as Stripe.Invoice,
        );
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return { received: true };
  }

  private async handleSubscriptionPaymentSucceeded(invoice: Stripe.Invoice) {
    console.log(invoice.customer_email);
    // customer_email
    // approve user and conver it to owner
    const user = await this.userService.approve(
      { email: invoice.customer_email },
      { isApproved: true, role: Role.Owner },
    );
    // TODO:send email notification to owner
    const emailParams: EmailParams = {
      recipientMail: user.email,
      subject: 'Subscription Payment Succeeded',
      message:
        'Your subscription payment has been succeeded , Now you are allowed to post 1 ad per month',
    };

    await this.emailService.sendEmail(emailParams);

    return true;
  }
}
