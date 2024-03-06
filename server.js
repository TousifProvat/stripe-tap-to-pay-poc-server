import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config({});

import Stripe from './utils/stripe.js';

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: '*',
  })
);
app.options('*', cors());

app.post('/connection_token', async (req, res) => {
  try {
    const connectionToken = await Stripe.terminal.connectionTokens.create();

    res.status(200).json({
      secret: connectionToken.secret,
    });
  } catch (err) {
    throw new Error(err);
  }
});

app.post('/reader-location', async (req, res) => {
  try {
    const location = await Stripe.terminal.locations.create({
      display_name: 'HQ',
      address: {
        line1: '448A Crownhill Rd',
        city: 'Plymouth',
        country: 'GB',
        postal_code: 'PL5 2QT',
      },
    });
    res.status(201).json({
      message: 'Location created successfully',
      location: location,
    });
  } catch (err) {
    console.log({ err });
    throw new Error(err);
  }
});

app.get('/readers', async (req, res) => {
  try {
    const readers = await Stripe.terminal.readers.list();

    res.status(201).json(readers);
  } catch (err) {
    console.log({ err });
    throw new Error(err);
  }
});

app.post('/create-payment-intent', async (req, res) => {
  try {
    const intent = await Stripe.paymentIntents.create({
      amount: 100,
      currency: 'usd',
      payment_method_types: ['card_present'],
      capture_method: 'automatic',
    });

    res.status(201).json({
      client_secret: intent.client_secret,
    });
  } catch (err) {
    console.log({ err });
    throw new Error(err);
  }
});

app.get('/health-check', async (req, res, next) => {
  try {
    res.status(200).json({
      message: 'working fine',
    });
  } catch (err) {
    throw new Error(err);
  }
});

app.listen(PORT, () => {
  console.log('listening on port ' + PORT);
});
