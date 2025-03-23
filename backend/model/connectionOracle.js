import dotenv from 'dotenv'

dotenv.config()

// informações que vão ficar no .env para só os devs terem acesso ao banco
const dbConfig = {
    user: dotenv.DB_USER,
    password: dotenv.DB_PASSWORD,
    connectString: dotenv.DB_STRING_CONNECT
}

