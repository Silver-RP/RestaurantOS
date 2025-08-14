// review.service.ts
import ReviewModel, { IReview } from '../models/ReviewModel';
import { Order } from '../models/OrderModel';
import { Types } from 'mongoose';
import { OrderDetail } from '../models/OrderDetailModel';
import { Dish } from '../models/DishModel';

export const ReviewService = {
  async createReview({
    productId,
    userId,
    rating,
    comment,
  }: {
    productId: Types.ObjectId;
    userId: Types.ObjectId;
    rating: number;
    comment: string;
  }): Promise<IReview> {
    const existingReview = await ReviewModel.findOne({ productId, userId });
    if (existingReview) {
      throw new Error('Bạn đã đánh giá sản phẩm này rồi.');
    }

    // Chỉ lấy các đơn hàng đã giao thành công (DELIVERED)
    const deliveredOrders = await Order.find({ user_id: userId, status: 'DELIVERED' }).select('_id');
    const orderIds = deliveredOrders.map((order) => order._id);

    // Kiểm tra xem trong các đơn hàng đã giao có món ăn này không
    const hasPurchased = await OrderDetail.findOne({
      order_id: { $in: orderIds },
      dish_id: productId, // productId là dish_id
    });

    if (!hasPurchased) {
      throw new Error('Bạn chỉ có thể đánh giá món ăn đã mua và đã được giao thành công.');
    }

    const review = new ReviewModel({
      productId,
      userId,
      rating,
      comment,
      isVerifiedPurchase: true,
    });

    // === Incremental Update ===
    const dish = await Dish.findById(productId).select('rating_count rating');

    if (dish) {
      const newCount = dish.rating_count + 1;
      const newTotalRating = dish.rating + rating;
      const newAverage = Number((newTotalRating / newCount).toFixed(1));

      await Dish.findByIdAndUpdate(productId, {
        $inc: { rating_count: 1, rating: rating },
        $set: { average_rating: newAverage },
      });
    }

    return review.save();
  },

  async getReviewsByProduct(productId: string, page = 1, limit = 5, ratingFilter?: number) {
    const query: any = { productId: new Types.ObjectId(productId) };
    if (ratingFilter) query.rating = ratingFilter;

    const options = {
      page,
      limit,
      sort: { date: -1 },
      populate: {
        path: 'userId',
        select: 'username',
        model: 'User',
      },
    };

    return ReviewModel.paginate(query, options);
  },

  async updateReview(
    reviewId: string,
    userId: Types.ObjectId,
    updateData: Partial<Pick<IReview, 'comment' | 'rating'>>,
  ): Promise<IReview> {
    const review = await ReviewModel.findById(reviewId);
    if (!review) throw new Error('Không tìm thấy đánh giá');

    if (!review.userId.equals(userId)) {
      throw new Error('Bạn không có quyền chỉnh sửa đánh giá này');
    }

    if (updateData.comment) review.comment = updateData.comment;
    if (updateData.rating) review.rating = updateData.rating;

    return review.save();
  },

  async toggleVisibility(reviewId: string): Promise<IReview> {
    const review = await ReviewModel.findById(reviewId);
    if (!review) throw new Error('Không tìm thấy đánh giá');
    review.isHidden = !review.isHidden;
    return review.save();
  },

  async deleteReview(reviewId: string, userId: Types.ObjectId) {
    const review = await ReviewModel.findOne({ _id: reviewId, userId });
    if (!review) throw new Error('Không tìm thấy đánh giá hoặc không có quyền.');
    return review.deleteOne();
  },

  async getRatingDistribution(productId: string) {
    const allReviews = await ReviewModel.find({ productId: new Types.ObjectId(productId) });
    const distribution = [0, 0, 0, 0, 0];

    allReviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        distribution[5 - r.rating]++;
      }
    });

    return distribution;
  },

  async getUserReviews(userId: Types.ObjectId, page = 1, limit = 10) {
    const options = {
      page,
      limit,
      sort: { date: -1 },
      populate: {
        path: 'productId',
        select: 'name images slug',
        model: 'Dish',
      },
    };

    return ReviewModel.paginate({ userId }, options);
  },
};
