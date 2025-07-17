export interface IReview {
    _id: string;
    productId: string;
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