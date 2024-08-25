<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>



  <p align="center"> NestJS API for Sales and purchases of land and real estate </p>
    
## Table of Contents
- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Running the app](#running-the-app)
- [Test](#test)

## Description

Api To facilitate the process of Sellling the lands and real states. where the guest will find all the available ones he want with out need to many search on groups or websites

## Features
- Passport strategies for authorization and authorization
- RBAC is applicable to various roles (guest, owner, assistant, admin)
- User Managment System
- Ads Managment System 
- Verification and email services
- Approval system for owners and Ads
- Rpository Design Pattern 
  

## Installation

```bash
$ npm install
```
s

## Environment Variables

Ensure the following environment variables are set up before running the application:

### JWT and Node Environment
- `JWT_SECRET`: Secret key for signing JWT tokens.
- `NODE_ENV`: The environment mode (`development` or `production`).

### Database Configuration
- `MONGO_URI_DEV`: MongoDB URI for development.
- `MONGO_URI_PROD`: MongoDB URI for production.

### AWS Credentials
- `AWS_ACCESS_KEY_ID`: AWS access key for authentication.
- `AWS_SECRET_ACCESS_KEY`: AWS secret key for authentication.
- `AWS_S3_REGION`: AWS S3 bucket region.

### Cloudinary Configuration
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name.
- `CLOUDINARY_API_KEY`: Cloudinary API key.
- `CLOUDINARY_API_SECRET`: Cloudinary API secret.

### Email Configuration

#### Development Environment
- `MAILTRAP_SENDER_NAME`: Name of the email sender.
- `MAILTRAP_EMAIL`: Email address used for Mailtrap.
- `MAILTRAP_HOST`: SMTP host for Mailtrap.
- `MAILTRAP_PORT`: SMTP port for Mailtrap.
- `MAILTRAP_EMAIL_USERNAME`: Mailtrap username.
- `MAILTRAP_EMAIL_PASSWORD`: Mailtrap password.

#### Production Environment
- `GMAIL_SENDER_NAME`: Name of the email sender.
- `GMAIL_EMAIL_HOST`: SMTP host for Gmail.
- `GMAIL_EMAIL_PORT`: SMTP port for Gmail.
- `GMAIL_EMAIL_USER`: Gmail email address.
- `GMAIL_EMAIL_PASSWORD`: Gmail password.

### Application URLs
- `DEVELOPMENT_URL`: URL for the development environment.
- `PRODUCTION_URL`: URL for the production environment.

### Stripe Configuration
- `STRIPE_SECRET_KEY`: Stripe secret key for payment processing.


## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```.
