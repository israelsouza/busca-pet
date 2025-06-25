import request from 'supertest';
import app from '../app.js';

describe( "POST /api/usuario/cadastro", () => {
    test('deve cadastrar usuário com sucesso', async () => { 
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

     test('deve falhar ao cadastrar usuário com dados inválidos', async () => {
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

describe( "POST /api/usuario/login", () => {
    test('should login an user', async () => {
        const emailTesting = "raquel@teste.com";
        const response = await request(app).post('/api/usuario/login').send({
            email: emailTesting,
            password: '123123'
        })
        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({
            message: "Usuario cadastrado com sucesso",
            token: {
                email: emailTesting,
                id: expect.any(Number),
                role: null,
                token: expect.any(String)
            }
        })
    })

    test('should throw a error when try to login an user', async () => {
        const emailTesting = "raquel@teste.com";
        const response = await request(app).post('/api/usuario/login').send({
            email: emailTesting,
            password: '12'
        })
        expect(response.status).toBe(500)
        expect(response.body).toEqual({message: "Erro interno do servidor", error: {}})
    })
})

