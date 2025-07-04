import request from 'supertest';
import app from '../app.js';
import { gerarAuthToken } from './utils/auth.js';
import oracledb from 'oracledb';


afterAll(async () => {
  try {
    await oracledb.getPool().close(10);
  } catch (err) {
    if (err.code !== 'NJS-047') {
      throw err; 
    }
  }
});

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

describe(`GET ${API_POST}/:categoria`,()=>{

    const categorias =  ['Perdido', 'Encontrado', 'todos']

    test.each(categorias)(
        'Deve carregar os posts com a categoria %s com sucesso',
        async (categoria) => {
            const response = await request(app)
                .get(`${API_POST}/${categoria}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({
                message: 'Posts capturados com sucesso',
                posts: expect.any(Array)
            });
        }
    )

    test('Deve retornar 404 se a categoria não existir', async () => {
        const response = await request(app)
            .get(`${API_POST}/categoria-inexistente`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject({
            error: "Categoria inserida inválida, tente novamente"
        });
    });
})

describe(`GET ${API_POST}/buscar/termo`, ()=>{
    test('Deve posts com a palavra-chave inserida', async () => {
        const termoBuscado = 'Av. Águia de Haia'

        const response = await request(app)
                .get(`${API_POST}/buscar/termo`)
                .set('Authorization', `Bearer ${token}`)
                .query({ q: termoBuscado });
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            message: "Posts encontrados com sucesso",
            posts: expect.any(Array)
        });
    })

    test('Deve retornar ERRO ao buscar posts sem o token', async () => {
        const termoBuscado = 'Av. Águia de Haia'

        const response = await request(app)
                .get(`${API_POST}/buscar/termo`)
                .query({ q: termoBuscado });
        
        expect(response.statusCode).toBe(401);
        expect(response.body).toMatchObject({
            message: "Token não fornecido"
        });
    })    
})

describe(`GET ${API_POST}/buscar/termo/area`, ()=>{
    test('Deve retornar posts e raio de proximidade', async () => {

        const valLat = parseFloat(-23.514356);
        const valLng = parseFloat(-46.476766);
        const valRaio = parseFloat(4);

        const response = await request(app)
                .get(`${API_POST}/buscar/termo/area`)
                .set('Authorization', `Bearer ${token}`)
                .query({
                    lat: valLat,
                    lng: valLng,
                    raio: valRaio
                });
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            messagem: "Posts encontrados com sucesso",
            consulta: expect.any(Array),
            radius: valRaio
        });
    })

    test('Deve retornar ERRO ao buscar posts sem o token', async () => {
        const termoBuscado = 'Av. Águia de Haia'

        const response = await request(app)
                .get(`${API_POST}/buscar/termo`)
                .query({ q: termoBuscado });
        
        expect(response.statusCode).toBe(401);
        expect(response.body).toMatchObject({
            message: "Token não fornecido"
        });
    })    
})