import log from '../utils/logger.js'
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from "../configs/authConfig.js";

class TokenService {
    gerarToken({userId, role, email}){
        log('INFO', 'TOKENSERVICE', 'gerarToken', 'INICIO')
        const token = jwt.sign(
            {
                id: userId,
                email: email,
                role: role
            },
            SECRET_KEY,
            {
                expiresIn: "1d"
            }
        )
        log('INFO', 'TOKENSERVICE', 'gerarToken', 'FIM')
        return token;        
    }
}

export default new TokenService();