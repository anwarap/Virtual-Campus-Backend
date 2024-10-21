import jwt from 'jsonwebtoken';

export const  generateToken = (id,username,email,role)=>{
    const jwtKey = process.env.JWT_KEY
    if(jwtKey){

        return jwt.sign({id,username,email,role},jwtKey,{
            expiresIn:"1h"
        });
    }else{
        throw new Error("Jwt key not found");
    }
}