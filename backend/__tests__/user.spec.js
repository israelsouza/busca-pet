import request from 'supertest';
import app from '../app.js';

describe( "User endpoint", () => {
    test('should create an user', async () => { 
        const unique = Date.now();
        const response = await request(app)
            .post('/api/usuario/cadastro')
            .send({
                nome: "João Paulo", 
                email: `joaozinho${unique}@teste.com.br`, 
                senha: "joao_boladao", 
                telefone: `11948${unique.toString().slice(-6)}`, 
                rua: "Caipira da Esquina", 
                bairro: "Jd dos Camponeses", 
                cep: "19605033",
                cidade: "São Paulo", 
                estado: "SP"
            });
        expect(response.status).toBe(200)
        expect(response.body).toEqual({message: "Usuario cadastrado com sucesso" })
     })

     test('should throw error on try create user', async () => {
        const unique = Date.now();
        const error = {};
        const response = await request(app)
            .post('/api/usuario/cadastro')
            .send({
                nome: "João Paulo", 
                email: `joaozinho1234@teste.com.br`, 
                senha: "joao_boladao", 
                telefone: `11948${unique.toString().slice(-6)}`, 
                rua: "Caipira da Esquina", 
                bairro: "Jd dos Camponeses", 
                cep: "19605033",
                cidade: "São Paulo", 
                estado: "SP"
            });
        expect(response.status).toBe(500)
        expect(response.body).toEqual({message: "Erro interno do servidor", error})
     })

} )