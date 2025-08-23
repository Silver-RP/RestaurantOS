import { Dish } from '../models/DishModel';
import Category from '../models/CategoryModel';
import mongoose from 'mongoose';
import { Order } from '../models/OrderModel';
import { Favorite } from '../models/FavoriteModel';

interface DishInfo {
  _id: string;
  name: string;
  price: number;
  discount_price?: number;
  description: string;
  images: string[];
  slug: string;
  categories: any[];
  isDishNew?: boolean;
  isRecommend?: boolean;
}

class BotService {
  // Danh sách câu hỏi về đơn hàng, order, lịch sử mua
  getOrderQuestions(): string[] {
    return [
      "Tôi đã từng order món gì ở đây?",
      "Lịch sử đặt món của tôi như thế nào?",
      "Tôi muốn xem các món đã mua trước đó.",
      "Đơn hàng gần nhất của tôi gồm những món gì?",
      "Tôi đã đặt món steak chưa?",
      "Có thể xem lại các món tôi đã từng order không?",
      "Tôi muốn reorder món ăn đã mua lần trước.",
      "Tôi đã đặt món nào nhiều nhất?",
      "Có thể gợi ý món ăn dựa trên lịch sử mua của tôi không?",
      "Tôi muốn xem trạng thái đơn hàng hiện tại.",
      "Đơn hàng của tôi đã được xác nhận chưa?",
      "Tôi muốn biết đơn hàng của tôi đang ở đâu?",
      "Có thể xem chi tiết đơn hàng đã đặt không?",
      "Tôi muốn hủy đơn hàng vừa đặt.",
      "Tôi muốn đổi món trong đơn hàng vừa đặt.",
      "Tôi muốn thêm món vào đơn hàng hiện tại.",
      "Tôi muốn xem tổng tiền các đơn hàng đã mua.",
      "Có thể xem lại hóa đơn các lần mua trước không?",
      "Tôi muốn biết thời gian giao hàng dự kiến.",
      "Tôi muốn đánh giá món ăn đã mua.",
      "Tôi muốn xem các món ăn được mua nhiều nhất.",
      "Có thể gợi ý món ăn dựa trên đơn hàng trước không?",
      "Tôi muốn biết đơn hàng nào đang chờ xác nhận.",
      "Tôi muốn biết đơn hàng nào đã hoàn thành.",
      "Tôi muốn biết đơn hàng nào bị hủy.",
      "Tôi muốn biết đơn hàng nào đang giao.",
      "Tôi muốn biết đơn hàng nào đang chuẩn bị.",
      "Tôi muốn biết đơn hàng nào đã giao thành công.",
      "Tôi muốn biết đơn hàng nào bị lỗi.",
      "Tôi muốn biết đơn hàng nào đang chờ thanh toán.",
      "Tôi muốn biết đơn hàng nào đã thanh toán.",
      "Tôi muốn biết đơn hàng nào chưa thanh toán.",
      "Tôi muốn biết đơn hàng nào đang chờ giao hàng.",
      "Tôi muốn biết đơn hàng nào đang chờ lấy hàng.",
      "Tôi muốn biết đơn hàng nào đang chờ xác nhận thanh toán.",
      "Tôi muốn biết đơn hàng nào đang chờ xác nhận giao hàng.",
      "Tôi muốn biết đơn hàng nào đang chờ xác nhận hoàn thành.",
      "Tôi muốn biết đơn hàng nào đang chờ xác nhận hủy.",
      "Tôi muốn biết đơn hàng nào đang chờ xác nhận đổi món.",
      "Tôi muốn biết đơn hàng nào đang chờ xác nhận thêm món.",
      "Tôi muốn biết đơn hàng nào đang chờ xác nhận đánh giá.",
      "Tôi muốn biết đơn hàng nào đang chờ xác nhận phản hồi.",
      "Tôi muốn biết đơn hàng nào đang chờ xác nhận khiếu nại.",
      "Tôi muốn biết đơn hàng nào đang chờ xác nhận hỗ trợ.",
      "Tôi muốn biết đơn hàng nào đang chờ xác nhận hoàn tiền.",
      "Tôi muốn biết đơn hàng nào đang chờ xác nhận đổi trả.",
      "Tôi muốn biết đơn hàng nào đang chờ xác nhận bảo hành.",
      "Tôi muốn biết đơn hàng nào đang chờ xác nhận bảo trì.",
      "Tôi muốn biết đơn hàng nào đang chờ xác nhận sửa chữa."
    ];
  }
  // Tìm món ăn theo tên hoặc từ khóa
  async findDishesByKeyword(keyword: string): Promise<DishInfo[]> {
    try {
      const searchRegex = new RegExp(keyword, 'i');
      
      const dishes = await Dish.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { ingredients: searchRegex }
        ],
        status: 'available',
        isDeleted: false
      })
      .populate('categories', 'Cate_name Cate_slug')
      .limit(5)
      .lean();

      return dishes.map(dish => ({
        _id: dish._id.toString(),
        name: dish.name,
        price: dish.price,
        discount_price: dish.discount_price,
        description: dish.description,
        images: dish.images || [],
        slug: dish.slug,
        categories: dish.categories,
        isDishNew: dish.isDishNew,
        isRecommend: dish.isRecommend
      }));
    } catch (error) {
      console.error('Error finding dishes:', error);
      return [];
    }
  }

  // Lấy món ăn theo danh mục
  async getDishesByCategory(categoryName: string): Promise<DishInfo[]> {
    try {
      const category = await Category.findOne({
        Cate_name: { $regex: categoryName, $options: 'i' }
      });
      if (!category) return [];
      const dishes = await Dish.find({
        categories: category._id,
        status: 'available',
        isDeleted: false
      })
      .populate('categories', 'Cate_name Cate_slug')
      .limit(5)
      .lean();
      return dishes.map(dish => ({
        _id: dish._id.toString(),
        name: dish.name,
        price: dish.price,
        discount_price: dish.discount_price,
        description: dish.description,
        images: dish.images || [],
        slug: dish.slug,
        categories: dish.categories,
        isDishNew: dish.isDishNew,
        isRecommend: dish.isRecommend
      }));
    } catch (error) {
      console.error('Error getting dishes by category:', error);
      return [];
    }
  }

  // Lấy món ăn nổi bật
  async getFeaturedDishes(): Promise<DishInfo[]> {
    try {
      const dishes = await Dish.find({
        $or: [
          { isRecommend: true },
          { isDishNew: true }
        ],
        status: 'available',
        isDeleted: false
      })
      .populate('categories', 'Cate_name Cate_slug')
      .limit(6)
      .lean();
      return dishes.map(dish => ({
        _id: dish._id.toString(),
        name: dish.name,
        price: dish.price,
        discount_price: dish.discount_price,
        description: dish.description,
        images: dish.images || [],
        slug: dish.slug,
        categories: dish.categories,
        isDishNew: dish.isDishNew,
        isRecommend: dish.isRecommend
      }));
    } catch (error) {
      console.error('Error getting featured dishes:', error);
      return [];
    }
  }

  // Lấy món ăn theo giá
  async getDishesByPriceRange(minPrice: number, maxPrice: number): Promise<DishInfo[]> {
    try {
      const dishes = await Dish.find({
        price: { $gte: minPrice, $lte: maxPrice },
        status: 'available',
        isDeleted: false
      })
      .populate('categories', 'Cate_name Cate_slug')
      .limit(5)
      .lean();
      return dishes.map(dish => ({
        _id: dish._id.toString(),
        name: dish.name,
        price: dish.price,
        discount_price: dish.discount_price,
        description: dish.description,
        images: dish.images || [],
        slug: dish.slug,
        categories: dish.categories,
        isDishNew: dish.isDishNew,
        isRecommend: dish.isRecommend
      }));
    } catch (error) {
      console.error('Error getting dishes by price range:', error);
      return [];
    }
  }

  // Lấy món ăn yêu thích của người dùng
  async getFavoriteDishesByUser(userId: string): Promise<DishInfo[]> {
    try {
      // Giả sử có model Favorite với trường user và dishId
      const favorites = await Favorite.find({ user: userId }).lean();
      const dishIds = favorites.map(fav => fav.dishId);
      const dishes = await Dish.find({ _id: { $in: dishIds }, status: 'available', isDeleted: false })
        .populate('categories', 'Cate_name Cate_slug')
        .lean();
      return dishes.map(dish => ({
        _id: dish._id.toString(),
        name: dish.name,
        price: dish.price,
        discount_price: dish.discount_price,
        description: dish.description,
        images: dish.images || [],
        slug: dish.slug,
        categories: dish.categories,
        isDishNew: dish.isDishNew,
        isRecommend: dish.isRecommend
      }));
    } catch (error) {
      console.error('Error getting favorite dishes by user:', error);
      return [];
    }
  }

  // Lấy món ăn theo dịp
  async getDishesByOccasion(occasion: string): Promise<DishInfo[]> {
    try {
      // Giả sử có trường 'occasionTags' trong Dish
      const searchRegex = new RegExp(occasion, 'i');
      const dishes = await Dish.find({
        occasionTags: searchRegex,
        status: 'available',
        isDeleted: false
      })
      .populate('categories', 'Cate_name Cate_slug')
      .lean();
      return dishes.map(dish => ({
        _id: dish._id.toString(),
        name: dish.name,
        price: dish.price,
        discount_price: dish.discount_price,
        description: dish.description,
        images: dish.images || [],
        slug: dish.slug,
        categories: dish.categories,
        isDishNew: dish.isDishNew,
        isRecommend: dish.isRecommend
      }));
    } catch (error) {
      console.error('Error getting dishes by occasion:', error);
      return [];
    }
  }

  // Lấy món ăn theo nguyên liệu
  async getDishesByIngredient(ingredient: string): Promise<DishInfo[]> {
    const searchRegex = new RegExp(ingredient, 'i');
    const dishes = await Dish.find({
      ingredients: searchRegex,
      status: 'available',
      isDeleted: false
    })
    .populate('categories', 'Cate_name Cate_slug')
    .lean();
    return dishes.map(dish => ({
      _id: dish._id.toString(),
      name: dish.name,
      price: dish.price,
      discount_price: dish.discount_price,
      description: dish.description,
      images: dish.images || [],
      slug: dish.slug,
      categories: dish.categories,
      isDishNew: dish.isDishNew,
      isRecommend: dish.isRecommend
    }));
  }

  // Tạo link đến trang chi tiết món ăn
  createDishLink(slug: string): string {
    return `https://beefbeef.vn/menu/${slug}`;
  }

  // Format giá tiền
  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  // Tạo message với hình ảnh món ăn
  createDishMessage(dish: DishInfo): { content: string; attachments: string[] } {
    const priceText = dish.discount_price 
      ? `~~${this.formatPrice(dish.price)}~~ **${this.formatPrice(dish.discount_price)}**`
      : this.formatPrice(dish.price);

    const badges = [];
    if (dish.isDishNew) badges.push('🆕 Món mới');
    if (dish.isRecommend) badges.push('⭐ Khuyến nghị');
    
    const badgeText = badges.length > 0 ? `\n${badges.join(' | ')}` : '';

    const content = `🍽️ **${dish.name}**${badgeText}
💰 Giá: ${priceText}
📝 ${dish.description}
🔗 Xem chi tiết: ${this.createDishLink(dish.slug)}`;

    return {
      content,
      attachments: dish.images || []
    };
  }

  // Tạo message giới thiệu nhiều món ăn
  createDishesListMessage(dishes: DishInfo[], title: string): { content: string; attachments: string[] } {
    if (dishes.length === 0) {
      return {
        content: ` Xin lỗi, hiện tại chưa có món ăn nào phù hợp với yêu cầu của bạn.`,
        attachments: []
      };
    }

    let content = `🍽️ **${title}**\n\n`;
    const allImages: string[] = [];

    dishes.forEach((dish, index) => {
      const priceText = dish.discount_price
        ? `~~${this.formatPrice(dish.price)}~~ ➡️ **${this.formatPrice(dish.discount_price)}**`
        : `**${this.formatPrice(dish.price)}**`;

      const badges = [];
      if (dish.isDishNew) badges.push('🆕 Món mới');
      if (dish.isRecommend) badges.push('⭐ Khuyến nghị');
      const badgeText = badges.length > 0 ? `\n${badges.join(' | ')}` : '';

      content += `─────────────────────────────\n`;
      content += `🍲 **${dish.name}**${badgeText}\n`;
      content += `💰 Giá: ${priceText}\n`;
      if (dish.description) {
        content += `📝 ${dish.description}\n`;
      }
      content += `🔗 [Xem chi tiết](${this.createDishLink(dish.slug)})\n`;
      content += `─────────────────────────────\n\n`;

      if (dish.images && dish.images.length > 0) {
        allImages.push(dish.images[0]);
      }
    });

    content += `💡 *Bạn có thể click vào link để xem chi tiết và đặt món!*`;

    return {
      content,
      attachments: allImages
    };
  }

  // Lấy món ăn đã mua của người dùng
  async getDishesBoughtByUser(userId: string): Promise<DishInfo[]> {
    // Giả sử có model Order với trường user và items (mỗi item chứa dishId)
    interface OrderItem {
      dishId: mongoose.Types.ObjectId | string;
      quantity?: number;
      [key: string]: any;
    }

    interface OrderDoc {
      _id: mongoose.Types.ObjectId;
      user: mongoose.Types.ObjectId | string;
      status: string;
      items?: OrderItem[];
      [key: string]: any;
    }

    const orders = await Order.find({ user: userId, status: 'completed' }).lean();

    const dishIds: (mongoose.Types.ObjectId | string)[] = orders.flatMap(order => (order.items?.map(item => item.dishId)) || []);
    const dishes = await Dish.find({ _id: { $in: dishIds }, status: 'available', isDeleted: false })
      .populate('categories', 'Cate_name Cate_slug')
      .lean();
    return dishes.map(dish => ({
      _id: dish._id.toString(),
      name: dish.name,
      price: dish.price,
      discount_price: dish.discount_price,
      description: dish.description,
      images: dish.images || [],
      slug: dish.slug,
      categories: dish.categories,
      isDishNew: dish.isDishNew,
      isRecommend: dish.isRecommend
    }));
  }
}

export default new BotService();