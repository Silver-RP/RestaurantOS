import jwt from "jsonwebtoken"; 

/**
 * Hàm để tạo JWT token
 * @param payload Dữ liệu cần lưu trữ trong token 
 * @param secretKey Key để tạo token
 * @param expiresIn Thời gian sống của token
 * @returns JWT token
 */
export const accessToken = (payload: object, secretKey: string, expires: string = "2h") => {
    return jwt.sign(payload, secretKey, {expiresIn: expires});
}
export const refreshToken = (payload: object, secretKey: string, expires: string = "7d") => {
    return jwt.sign(payload, secretKey, {expiresIn: expires});
}
