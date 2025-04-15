import { Request, Response } from "express"; 
// Tôi đang làm middelware xác thực Facebook
import axios from "axios"; 
class FacebookAuthMiddleware {
  async verifyFacebookToken(req: Request, res: Response, next: any): Promise<any> {
    try {
      const { access_token } = req.body; 
      if(!access_token){
        return res.status(401).json({message: "Access Denied - No token provided"}); 
      }
      const url = `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${access_token}`; 
      const response = await axios.get(url); 
      const { id, name, email, picture } = response.data; 
      req.body.facebookUser = {
        id, 
        name, 
        email, 
        picture
      }
      return next(); 
    } catch (error) {
      console.error("Error verifying Facebook token:", error); 
      return res.status(401).json({message: "Access Denied - Error verifying token"}); 
    }
  }
}
export default new FacebookAuthMiddleware();
