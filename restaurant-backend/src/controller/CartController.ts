import { Request, Response } from 'express';
import cartService from '../services/CartService';

class CartController {
  static async UpdateCart(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { dishId, quantity } = req.body;

      if (!id || !dishId || typeof quantity !== 'number') {
        res.status(400).json({ success: false, message: 'Missing or invalid input fields' });
        return;
      }
      const updatedCart = await cartService.UpdateCart(id, dishId, quantity);
      res.status(200).json({
        success: true,
        message: 'Cart updated successfully',
        data: updatedCart,
      });
    } catch (error: any) {
      console.error('Error updating cart:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  static async DeleteCartItem(req: Request, res: Response): Promise<void> {
    try {
      const { cartId, dishId } = req.params;
      if (!cartId || !dishId) {
        res.status(400).json({ success: false, message: 'Missing cartId or dishId' });
        return;
      }
      const updatedCart = await cartService.DeleteCartItem(cartId, dishId);
      if (!updatedCart) {
        res.status(404).json({ success: false, message: 'Cart not found' });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'Cart item deleted successfully',
        data: updatedCart,
      });
    } catch (error: unknown) {
      console.error('Error deleting cart item:', error);
      if (error instanceof Error) {
        res.status(500).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
    }
  }

  static async DeleteAllCart(req: Request, res: Response): Promise<void> {
    try {
      const { cartId } = req.params;
      if (!cartId) {
        res.status(400).json({ success: false, message: 'Missing cartId' });
        return;
      }
      const deletedCart = await cartService.DeleteAllCart(cartId);
      if (!deletedCart) {
        res.status(404).json({ success: false, message: 'Cart not found' });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'All items in cart deleted successfully',
        data: deletedCart,
      });
    } catch (error: unknown) {
      console.error('Error deleting all items in cart:', error);
      if (error instanceof Error) {
        res.status(500).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
    }
  }
}

export default CartController;
