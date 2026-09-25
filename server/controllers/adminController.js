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

// @desc    Get order status breakdown and 30-day timeline analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAdminAnalytics = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const [statusDistribution, dailyRevenueAndOrders] = await Promise.all([
      // Status breakdown
      Order.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalValue: { $sum: '$totalAmount' }
          }
        }
      ]),
      // Daily revenue & order count over the last 30 days
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            revenue: {
              $sum: {
                $cond: [{ $eq: ['$isPaid', true] }, '$totalAmount', 0]
              }
            },
            orders: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ])
    ]);

    // Build continuous 30-day array (fill missing dates with 0)
    const timelineData = [];
    const dailyMap = new Map();
    dailyRevenueAndOrders.forEach(d => {
      dailyMap.set(d._id, {
        revenue: Math.round(d.revenue * 100) / 100,
        orders: d.orders
      });
    });

    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const entry = dailyMap.get(dateStr) || { revenue: 0, orders: 0 };
      timelineData.push({
        date: dateStr,
        formattedDate: monthDay,
        revenue: entry.revenue,
        orders: entry.orders
      });
    }

    // Format status distribution with known statuses guaranteed
    const ALL_STATUSES = ['Pending', 'Processing', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];
    const statusMap = new Map();
    statusDistribution.forEach(s => {
      statusMap.set(s._id, { count: s.count, totalValue: Math.round(s.totalValue * 100) / 100 });
    });

    const formattedStatusDistribution = ALL_STATUSES.map(status => {
      const data = statusMap.get(status) || { count: 0, totalValue: 0 };
      return {
        status,
        count: data.count,
        totalValue: data.totalValue
      };
    });

    res.status(200).json({
      success: true,
      data: {
        statusDistribution: formattedStatusDistribution,
        timelineData
      }
    });
  } catch (error) {
    next(error);
  }
};

