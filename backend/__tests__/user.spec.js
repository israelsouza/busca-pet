import request from 'supertest';
import app from '../app.js';
import TokenService from '../service/TokenService.js';
import { gerarAuthToken } from './utils/auth.js';

const API_USUARIO = '/api/usuario'

// describe( `POST ${API_USUARIO}/cadastro`, () => {
//     test('deve cadastrar usuário com sucesso', async () => { 
//         const unique = Date.now();
//         const response = await request(app)
//             .post(`${API_USUARIO}/cadastro`)
//             .send({
//                 nome: "João Paulo", 
//                 email: `joaozinho${unique}@teste.com.br`, 
//                 senha: "joao_boladao", 
//                 telefone: `11948${unique.toString().slice(-6)}`, 
//                 rua: "Caipira da Esquina", 
//                 bairro: "Jd dos Camponeses", 
//                 cep: "19605033",
//                 cidade: "São Paulo", 
//                 estado: "SP"
//             });
//         expect(response.status).toBe(200)
//         expect(response.body).toEqual({message: "Usuario cadastrado com sucesso" })
//      })

//      test('deve falhar ao cadastrar usuário com dados inválidos', async () => {
//         const unique = Date.now();
//         const error = {};
//         const response = await request(app)
//             .post(`${API_USUARIO}/cadastro`)
//             .send({
//                 nome: "João Paulo", 
//                 email: `joaozinho1234@teste.com.br`, 
//                 senha: "joao_boladao", 
//                 telefone: `11948${unique.toString().slice(-6)}`, 
//                 rua: "Caipira da Esquina", 
//                 bairro: "Jd dos Camponeses", 
//                 cep: "19605033",
//                 cidade: "São Paulo", 
//                 estado: "SP"
//             });
//         expect(response.status).toBe(500)
//         expect(response.body).toEqual({message: "Erro interno do servidor", error})
//      })

// } )

// describe( `POST ${API_USUARIO}/login`, () => {
//     test('should login an user', async () => {
//         const emailTesting = "raquel@teste.com";
//         const response = await request(app).post(`${API_USUARIO}/login`).send({
//             email: emailTesting,
//             password: '123123'
//         })
//         expect(response.status).toBe(200)
//         expect(response.body).toMatchObject({
//             message: "Usuario cadastrado com sucesso",
//             token: {
//                 email: emailTesting,
//                 id: expect.any(Number),
//                 role: null,
//                 token: expect.any(String)
//             }
//         })
//     })

//     test('should throw a error when try to login an user', async () => {
//         const emailTesting = "raquel@teste.com";
//         const response = await request(app).post(`${API_USUARIO}/login`).send({
//             email: emailTesting,
//             password: '12'
//         })
//         expect(response.status).toBe(500)
//         expect(response.body).toEqual({message: "Erro interno do servidor", error: {}})
//     })
// })

// describe( `POST ${API_USUARIO}/solicitar-nova-senha`, () => {
//     test('deve criar token e enviar ao email com sucesso', async () => {
//         const email = "israellimas@hotmail.com";
//         const response = await request(app).post(`${API_USUARIO}/solicitar-nova-senha`).send({
//             email: email
//         })
//         expect(response.status).toBe(200)
//         expect(response.body).toEqual({message: "Email enviado! Verifique a sua caixa de spam, se necessário", success: true})
//     })

//     test('deve lançar erro ao tentar criar token e enviar ao email', async () => {
//         const response = await request(app).post(`${API_USUARIO}/solicitar-nova-senha`).send({})
//         expect(response.status).toBe(500)
//         expect(response.body).toEqual({ error: "Ocorreu um erro interno. Por favor, tente novamente mais tarde." })
//     })
// })

// describe( `POST ${API_USUARIO}/validar-token`, () => {
//     test("should aprove the token create before", async ()=>{
//         const email = "israellimas@hotmail.com";
//         const token = await TokenService.recuperarTokenRecuperarSenha(email)
//         const response = await request(app).post(`${API_USUARIO}/validar-token`).send({
//             email, token: token.REC_TOKEN
//         })
//         expect(response.status).toBe(200)
//         expect(response.body).toMatchObject({ 
//             mensagem: "Token válido.", 
//             usu_id: expect.any(Number), 
//             success: true 
//         })
//     })

//     test("should aprove the token create before", async ()=>{
//         const email = "israellimas@hotmail.com";
//         const token = await TokenService.recuperarTokenRecuperarSenha(email)
//         const response = await request(app).post(`${API_USUARIO}/validar-token`).send({
//             token: token.REC_TOKEN
//         })
//         expect(response.status).toBe(500)
//         expect(response.body).toMatchObject({ erro: "Erro interno ao validar o token." })
//     })

// })

// describe( `POST ${API_USUARIO}/registrar-nova-senha`, () => {
//     test("should update the password with success", async ()=>{
//         const email = "israellimas@hotmail.com";
//         const response = await request(app).post(`${API_USUARIO}/registrar-nova-senha`).send({
//             email,
//             password: "123456789"
//         })
//         expect(response.status).toBe(200)
//         expect(response.body).toEqual({ message: "Sucesso, senha atualizada. Realize o login.", success: true })
//     })

//     test("should throw an error when try to update the password", async ()=>{
//         const email = "israellimas@hotmail.com";
//         const response = await request(app).post(`${API_USUARIO}/registrar-nova-senha`).send({
//             email,
//         })
//         expect(response.status).toBe(400)
//         expect(response.body).toEqual({message: "Erro ao tentar atualizar a senha. Tente novamente"})
//     })
// })

describe( `GET ${API_USUARIO}/foto`, () => {
    let token;

    beforeAll(async () => {
        token = await gerarAuthToken();
    });

    test('should get user profile photo', async () => {
        const response = await request(app)
            .get(`${API_USUARIO}/foto`)
            .set('Authorization', `Bearer ${token}`)
            
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('foto'); 
    })

    test('should return 401 if no token is provided', async () => {
        const response = await request(app)
            .get(`${API_USUARIO}/foto`)
            
        expect(response.status).toBe(401)
        expect(response.body).toEqual({ message: 'Token não fornecido' }); 
    })
})

