import Stripe from 'stripe';
import Tour from '../models/tourModel.js';
import Booking from '../models/bookingModel.js';
import {
    deleteOne,
    updateOne,
    getOne,
    getAll,
    createOne,
} from './handlerFactory.js';
// import {} from './handlerFactory.js';

// The package needs to be configured with your account's secret key.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getCheckoutSession = async (req, res, next) => {
    // 1.) Get the currently booked tour
    const tour = await Tour.findById(req.params.tourID);

    // 2.) Create checkout session
    const session = await stripe.checkout.sessions.create({
        // Session info
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?tour=${
            req.params.tourID
        }&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourID,
        // Product being purchased info
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    unit_amount: tour.price * 100,
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: [
                            `https://www.natours.dev/img/tours/${tour.imageCover}`,
                        ],
                    },
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
    });

    // 3.) Send session as response
    res.status(200).json({
        status: 'success',
        session,
    });
};

const createBookingsCheckout = async (req, res, next) => {
    // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying.
    const { tour, user, price } = req.query;

    if (!tour && !user && !price) return next();

    // Create new booking
    await Booking.create({ tour, user, price });

    // Redirect back to homepage WITHOUT the query attached
    res.redirect(req.originalUrl.split('?')[0]);
};

const createBooking = createOne(Booking);
const deleteBooking = deleteOne(Booking);
const updateBooking = updateOne(Booking);
const getBooking = getOne(Booking);
const getAllBooking = getAll(Booking);

export {
    getCheckoutSession,
    createBookingsCheckout,
    createBooking,
    deleteBooking,
    updateBooking,
    getBooking,
    getAllBooking,
};
