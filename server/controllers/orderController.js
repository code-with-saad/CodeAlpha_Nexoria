import Stripe from 'stripe';
import Order from '../models/Order.js';

// Initialize Stripe instance lazily or safely
const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_for_nexoria_dev';
  return new Stripe(secretKey);
};

// @desc    Create a Stripe PaymentIntent
// @route   POST /api/orders/create-payment-intent
// @access  Private
export const createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    if (!amount || amount <= 0) {
      res.status(400);
      throw new Error('Valid order payment amount is required');
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const amountInCents = Math.round(Number(amount) * 100);

    // If live/valid test stripe key is configured in .env
    if (stripeSecretKey && stripeSecretKey.startsWith('sk_')) {
      try {
        const stripe = getStripe();
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amountInCents,
          currency: currency.toLowerCase(),
          metadata: {
            userId: req.user._id.toString(),
            userEmail: req.user.email
          },
          automatic_payment_methods: {
            enabled: true
          }
        });

        return res.status(200).json({
          success: true,
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id
        });
      } catch (stripeError) {
        console.warn('Stripe API error; falling back to test simulator:', stripeError.message);
      }
    }

    // Development & Test Mode simulation fallback
    const simulatedId = `pi_test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const simulatedClientSecret = `${simulatedId}_secret_${Math.random().toString(36).substring(2, 12)}`;

    res.status(200).json({
      success: true,
      clientSecret: simulatedClientSecret,
      paymentIntentId: simulatedId,
      isSimulated: true
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new order from cart
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod = 'Stripe',
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalAmount
    } = req.body;

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      res.status(400);
      throw new Error('Cart is empty. No order items provided');
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
      res.status(400);
      throw new Error('Please provide complete shipping address details');
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice: Number(itemsPrice) || 0,
      taxPrice: Number(taxPrice) || 0,
      shippingPrice: Number(shippingPrice) || 0,
      totalAmount: Number(totalAmount) || 0,
      status: 'Pending'
    });

    const createdOrder = await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: createdOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user order history
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order details
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Check authorization: must be order owner or admin
    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403);
      throw new Error('Access denied: You are not authorized to view this order');
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Check authorization: must be order owner or admin
    const isOwner = order.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403);
      throw new Error('Access denied: You cannot update payment status for this order');
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.status = 'Paid';
    order.paymentResult = {
      id: req.body.id || `pay_${Date.now()}`,
      status: req.body.status || 'succeeded',
      update_time: req.body.update_time || new Date().toISOString(),
      email_address: req.body.email_address || req.user.email
    };

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: 'Order successfully marked as paid',
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order fulfillment status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      res.status(400);
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.status = status;

    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    } else if (status === 'Paid') {
      order.isPaid = true;
      if (!order.paidAt) order.paidAt = new Date();
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: `Order status successfully updated to ${status}`,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

