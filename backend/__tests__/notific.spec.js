import request from 'supertest';
import app from '../app.js';
import { gerarAuthToken } from './utils/auth.js';
import { gerarAdminAuthToken } from './utils/adminAuth.js';

const API_NOTIFIC = '/api/notificacao';

let token;

beforeAll(async () => {
    token = await gerarAuthToken();
});


describe(` POST ${API_NOTIFIC}/criar/mensagem`, () => {
    test("deve criar uma notificação ", async () => {
        const response = await request(app)
            .post(`${API_NOTIFIC}/criar/mensagem`)
            .set('Authorization', `Bearer ${token}`)
            .send({idPost: 301})
        
        expect(response.status).toEqual(201)
        expect(response.body).toMatchObject({
            message: "Mensagem enviada com sucesso."
        })
    })

    test("deve retornar ERRO sem enviar o ID do POST ", async () => {
        const response = await request(app)
            .post(`${API_NOTIFIC}/criar/mensagem`)
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toEqual(400)
        expect(response.body).toMatchObject({
            message: "Erro ao enviar mensagem."
        })
    })
})

describe(`POST ${API_NOTIFIC}/criar/denuncia`, () => {
    test('Deve criar uma denuncia com sucesso', async () => {
        const TIPO = 'Agressao Verbal';
        const DESCRICAO = 'Violencia contra os animais'
        const POST_ID = 306;
        const response = await request(app)
            .post(`${API_NOTIFIC}/criar/denuncia`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                tipo: TIPO,
                descricao: DESCRICAO, 
                idPost: POST_ID
            })

        expect(response.status).toEqual(201)
        expect(response.body).toMatchObject({
            message: "Denúncia criada com sucesso."
        })
    })

    test('Deve dar erro se não houver token', async () => {
        const TIPO = 'Agressao Verbal';
        const DESCRICAO = 'Violencia contra os animais'
        const POST_ID = 300;
        const response = await request(app)
            .post(`${API_NOTIFIC}/criar/denuncia`)
            .send({
                tipo: TIPO,
                descricao: DESCRICAO, 
                idPost: POST_ID
            })

        expect(response.status).toEqual(401)
        expect(response.body).toEqual({
           message: 'Token não fornecido'
        })
    })

    test('Deve dar erro se dados necessários não forem inseridos', async () => {
        const TIPO = 'Agressao Verbal';

        const response = await request(app)
            .post(`${API_NOTIFIC}/criar/denuncia`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                tipo: TIPO,
            })

        expect(response.status).toEqual(400)
        expect(response.body).toEqual({
           message: "Erro ao criar denúncia."
        })
    })

})

describe(`Rotas com autorização de ADM`, () => {

    let admToken;
    const ID_POST = 306;

    beforeAll(async () => {
        admToken = await gerarAdminAuthToken();
    });

    describe(`GET ${API_NOTIFIC}/denuncias`, () => {
        test('deve listar todas as denuncias abertas com sucesso', async () => {
            const response = await request(app)
                    .get(`${API_NOTIFIC}/denuncias`).
                    set('Authorization', `Bearer ${admToken}`)

            expect(response.status).toEqual(200)
            expect(response.body).toMatchObject({
                denuncias: expect.any(Object)
            })
        })

        test('deve barrar acesso de usuario comum em rota de ADM', async () => {
            const response = await request(app)
                    .get(`${API_NOTIFIC}/denuncias`)
                    .set('Authorization', `Bearer ${token}`)

            expect(response.status).toEqual(403)
            expect(response.body).toEqual({
                message: 'Acesso negado. Você não tem permissão de administrador.'
            })
        })

        test('deve dar erro 401 se não houver token', async () => {
            const response = await request(app)
                    .get(`${API_NOTIFIC}/denuncias`)

            expect(response.status).toEqual(401)
            expect(response.body).toEqual({
            message: 'Token não fornecido'
            })
        })
    })

    describe(`GET ${API_NOTIFIC}/denuncias/post/:id`, () => {
        test('deve buscar a denuncia pelo ID', async () => {        
            const response = await request(app)
                .get(`${API_NOTIFIC}/denuncias/post/${ID_POST}`)
                .set('Authorization', `Bearer ${admToken}`)
                .send({id: ID_POST})

            expect(response.status).toEqual(200)
            expect(response.body).toMatchObject({
                publicacao: expect.any(Object)
            })
        })

        test('deve falhar ao acessar com token comum', async () => {        
            const response = await request(app)
                .get(`${API_NOTIFIC}/denuncias/post/${ID_POST}`)
                .set('Authorization', `Bearer ${token}`)
                .send({id: ID_POST})

            expect(response.status).toEqual(403)
            expect(response.body).toEqual({
                message: 'Acesso negado. Você não tem permissão de administrador.'
            })
        })

        test('deve falhar ao tentar acessar sem o token', async () => {
            const response = await request(app)
                .get(`${API_NOTIFIC}/denuncias/post/${ID_POST}`)
                .send({id: ID_POST})

            expect(response.status).toEqual(401)
            expect(response.body).toEqual({
            message: 'Token não fornecido'
            })
        })

        test('deve falhar devido id não enviado', async () => {
            const response = await request(app)
                .get(`${API_NOTIFIC}/denuncias/post/null`)
                .set('Authorization', `Bearer ${admToken}`)
                .send()

            expect(response.status).toEqual(400)
            expect(response.body).toEqual({
            error: "ID da publicação inválido"
            })
        })
    })

})