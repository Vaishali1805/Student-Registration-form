import jwt from 'jsonwebtoken';

export const createToken = async (payload) => {
    const token = jwt.sign(payload,process.env.TOKEN_SECRET,{ expiresIn: '1h' });
    return token;
}

export const verifyToken = async (token) => {
    const result = jwt.verify(token,process.env.TOKEN_SECRET);
    return result;
}