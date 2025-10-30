import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = async (payload: object): Promise<string> => {
  return jwt.sign(payload, JWT_SECRET!, {expiresIn: "1h"})
}

export const verifydToken = (token: string) => {
  try{
    return jwt.verify(token, JWT_SECRET!);
  }catch(err){
    return null
  }
}