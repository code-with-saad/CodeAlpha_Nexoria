import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get administrative dashboard statistics and aggregations
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      revenueResult,
      lowStockCount,
      pendingOrdersCount,
      recentOrders
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: { $ne: 'admin' } }),
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
      ]),
      Product.countDocuments({ stock: { $lte: 5 } }),
      Order.countDocuments({ status: { $in: ['Pending', 'Processing'] } }),
      Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(6)
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalUsers,
        lowStockCount,
        pendingOrdersCount,
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};
