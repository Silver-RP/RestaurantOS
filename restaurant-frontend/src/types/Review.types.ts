export interface IReview {
    _id: string;
    productId: string | {
      _id: string;
      name: string;
      images?: string[];
      slug?: string;
    };
    userId: {
        _id: string;
        username: string;
      };
    rating: number;
    comment: string;
    isVerifiedPurchase: boolean;
    isHidden?: boolean;
    date: string;
    createdAt?: string;
    updatedAt?: string;
  }