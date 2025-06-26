import request from 'supertest';
import app from '../app.js';
import { gerarAuthToken } from './utils/auth.js';

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
            .send({idPost: 300})
        
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
        const POST_ID = 300;
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
})