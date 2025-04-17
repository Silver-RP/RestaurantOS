import * as jwt from 'jsonwebtoken';

export const accessToken = (
    payload: object,
    secretKey: string,
    expires: number = 2 * 60 * 60 // 2 hours in seconds
): string => {
    try {
        return jwt.sign(payload, secretKey, { expiresIn: expires });
    } catch (error) {
        console.error('Error creating access token:', error);
        throw new Error('Token creation failed');
    }
};


export const refreshToken = (
    payload: object,
    secretKey: string,
    expires: string = "7d"
): string => {
    try {
        return jwt.sign(payload, secretKey, { expiresIn: Number(expires) });
    } catch (error) {
        console.error('Error creating refresh token:', error);
        throw new Error('Token creation failed');
    }
};
