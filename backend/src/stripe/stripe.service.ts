import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { waitForDebugger } from 'inspector';
import { AdService } from 'src/ad/ad.service';
import { AdPaymentDto } from 'src/ad/dtos/ad-dto';
import { Role } from 'src/auth/decorators/roles.decorator';
import { UserRepository } from 'src/users/user.repository';
import { UsersService } from 'src/users/users.service';
import { EmailParams, EmailService } from 'src/utils/email/email.service';
import Stripe from 'stripe';
@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(
    private userRepository: UserRepository,
    private userService: UsersService,
    private emailService: EmailService,
    private adService: AdService,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
  }
  // we need customer id to track subscription and so on
  async createCheckoutSession(req: Request) {
    const user = await this.userRepository.findOne({ _id: req.user as string });
    let customerId = user.stripeCustomerId;

    // create customer id in not eixst
    if (!customerId) {
      const customer = await this.stripe.customers.create({
        email: user.email,
        name: user.username,
      });
      user.stripeCustomerId = customer.id;
      await user.save();

      customerId = customer.id;
    }
    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: this.configService.getOrThrow<string>('SUBSCRIPTION_PRICE_ID'),
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
      case 'customer.subscription.deleted':
        await this.handleSubscriptionEnd(
          event.data.object as Stripe.Subscription,
        );
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return { received: true };
  }

  private async handleSubscriptionPaymentSucceeded(invoice: Stripe.Invoice) {
    // approve user and conver it to owner
    const user = await this.userService.approve(
      { email: invoice.customer_email },
      { isApproved: true, role: Role.Owner },
    );

    // upadate the adds of the owner if exist before
    await this.adService.updateAdsForUser(user.id, true, false);

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
  private async handleSubscriptionEnd(subscription: Stripe.Subscription) {
    // 1) change role and disapprove user
    const user = await this.userRepository.findOne({
      stripeCustomerId: subscription.customer as string,
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    user.isApproved = false;
    user.role = Role.Guest;
    await user.save();

    // 2) diasble all ads fo this user         (approve , expired)
    await this.adService.updateAdsForUser(user.id, false, true);

    //3) send email to owner
    const emailParams: EmailParams = {
      recipientMail: user.email,
      subject: 'Subscription Ended',
      message:
        'Your subscription has ended, and your account and ads have been disabled.',
    };
    await this.emailService.sendEmail(emailParams);
  }
}
