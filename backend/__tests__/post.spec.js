import request from 'supertest';
import app from '../app.js';
import { gerarAuthToken } from './utils/auth.js';

const API_POST = '/api/posts';

let token;

    beforeAll(async () => {
        token = await gerarAuthToken();
    });

describe(`GET ${API_POST}/meus`, () => {
    test('Deve retornar as publicações do usuário autenticado', async () => {
        const response = await request(app)
            .get(`${API_POST}/meus`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            message: 'Ok',
            meusPosts: expect.any(Object)
        })
    });

    test('Deve retornar 401 se o token não for fornecido', async () => {
        const response = await request(app)
            .get(`${API_POST}/meus`);

        expect(response.statusCode).toBe(401);
        expect(response.body).toMatchObject({
            message: 'Token não fornecido'
        });
    });
})