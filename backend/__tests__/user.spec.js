import request from 'supertest';
import app from '../app.js';
import TokenService from '../service/TokenService.js';
import { gerarAuthToken } from './utils/auth.js';

const API_USUARIO = '/api/usuario'

describe(`ROTA PÚBLICA USUARIO`, () => {

    describe( `POST ${API_USUARIO}/cadastro`, () => {
        test('deve cadastrar usuário com sucesso', async () => { 
            const unique = Date.now();
            const response = await request(app)
                .post(`${API_USUARIO}/cadastro`)
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
                .post(`${API_USUARIO}/cadastro`)
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

    describe( `POST ${API_USUARIO}/login`, () => {
        test('should login an user', async () => {
            const emailTesting = "raquel@teste.com";
            const response = await request(app).post(`${API_USUARIO}/login`).send({
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
            const response = await request(app).post(`${API_USUARIO}/login`).send({
                email: emailTesting,
                password: '12'
            })
            expect(response.status).toBe(500)
            expect(response.body).toEqual({message: "Erro interno do servidor", error: {}})
        })
    })

    describe( `POST ${API_USUARIO}/solicitar-nova-senha`, () => {
        test('deve criar token e enviar ao email com sucesso', async () => {
            const email = "israellimas@hotmail.com";
            const response = await request(app).post(`${API_USUARIO}/solicitar-nova-senha`).send({
                email: email
            })
            expect(response.status).toBe(200)
            expect(response.body).toEqual({message: "Email enviado! Verifique a sua caixa de spam, se necessário", success: true})
        })

        test('deve lançar erro ao tentar criar token e enviar ao email', async () => {
            const response = await request(app).post(`${API_USUARIO}/solicitar-nova-senha`).send({})
            expect(response.status).toBe(500)
            expect(response.body).toEqual({ error: "Ocorreu um erro interno. Por favor, tente novamente mais tarde." })
        })
    })

    describe( `POST ${API_USUARIO}/validar-token`, () => {
        test("should aprove the token create before", async ()=>{
            const email = "israellimas@hotmail.com";
            const token = await TokenService.recuperarTokenRecuperarSenha(email)
            const response = await request(app).post(`${API_USUARIO}/validar-token`).send({
                email, token: token.REC_TOKEN
            })
            expect(response.status).toBe(200)
            expect(response.body).toMatchObject({ 
                mensagem: "Token válido.", 
                usu_id: expect.any(Number), 
                success: true 
            })
        })

        test("should aprove the token create before", async ()=>{
            const email = "israellimas@hotmail.com";
            const token = await TokenService.recuperarTokenRecuperarSenha(email)
            const response = await request(app).post(`${API_USUARIO}/validar-token`).send({
                token: token.REC_TOKEN
            })
            expect(response.status).toBe(500)
            expect(response.body).toMatchObject({ erro: "Erro interno ao validar o token." })
        })

    })

    describe( `POST ${API_USUARIO}/registrar-nova-senha`, () => {
        test("should update the password with success", async ()=>{
            const email = "ema9illlll@email.com";
            const response = await request(app).post(`${API_USUARIO}/registrar-nova-senha`).send({
                email,
                password: "123456789"
            })
            expect(response.status).toBe(200)
            expect(response.body).toEqual({ message: "Sucesso, senha atualizada. Realize o login.", success: true })
        })

        test("should throw an error when try to update the password", async ()=>{
            const email = "israellimas@hotmail.com";
            const response = await request(app).post(`${API_USUARIO}/registrar-nova-senha`).send({
                email,
            })
            expect(response.status).toBe(400)
            expect(response.body).toEqual({message: "Erro ao tentar atualizar a senha. Tente novamente"})
        })
    })

})

describe(`ROTAS PRIVADAS`, () => {

    let token;

    beforeAll(async () => {
        token = await gerarAuthToken();
    });

    describe( `GET ${API_USUARIO}/foto`, () => {
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

    describe(`GET ${API_USUARIO}/foto-com-nome`, () => {

        test('Deve retornar objeto com foto e nome do usuario', async () => {
            const response = await request(app).get(`${API_USUARIO}/foto-com-nome`).set(
                'Authorization', `Bearer ${token}`
            )

            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('foto');
        })

        test('Deve FALHAR ao tentar recuperar a foto e nome do usuario', async () => {
            const response = await request(app).get(`${API_USUARIO}/foto-com-nome`)

            expect(response.status).toBe(401)
            expect(response.body).toEqual({ message: 'Token não fornecido' });
        })

    })

    describe(`GET ${API_USUARIO}/perfil`, () => {
        test('deve retornar um objeto com os dados do usuário', async () => {
            const response = await request(app).get(`${API_USUARIO}/perfil`).set(
                'Authorization', `Bearer ${token}`
            );

            expect(response.status).toBe(200)
            expect(response.body).toMatchObject({
                message: "Dados cadastrais obtidos com sucesso!",
                userData: {
                    PES_NOME: expect.any(String),
                    PES_PHONE: expect.any(String),
                    USU_EMAIL: expect.any(String),
                    END_RUA: expect.any(String),
                    END_BAIRRO: expect.any(String),
                    CID_DESCRICAO: expect.any(String),
                    EST_SIGLA: expect.any(String),
                    USU_STATUS: 'A'
                },
            })
        })

        test('deve FALHAR ao tentar obter os dados do usuário', async () => {
            const response = await request(app).get(`${API_USUARIO}/perfil`)

            expect(response.status).toBe(401)
            expect(response.body).toEqual({ message: 'Token não fornecido' });
        })


    })

    describe(`GET ${API_USUARIO}/usuarios-e-denuncias`, () => {
        test('deve retornar lista de usuários com o contador de denúncias com sucesso (ADMIN)', async () => {
            const adminToken = await gerarAdminAuthToken();
            const response = await request(app)
                .get(`${API_USUARIO}/usuarios-e-denuncias`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Object);

        });

        test('deve retornar 403 se o usuário não for admin', async () => {
            const response = await request(app)
                .get(`${API_USUARIO}/usuarios-e-denuncias`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(403);
            expect(response.body).toEqual({ message: 'Acesso negado. Você não tem permissão de administrador.' });
        });

        test('deve retornar 401 se não houver token', async () => {
            const response = await request(app)
                .get(`${API_USUARIO}/usuarios-e-denuncias`);

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ message: 'Token não fornecido' });
        });
    });

    describe(`POST ${API_USUARIO}/perfil/:campo`, () => {

        const unique = Date.now();

        const camposParaAtualizar = [
            ['PES_NOME', 'Raquel Teste Dinamico'],
            ['PES_PHONE',`11950${unique.toString().slice(-6)}`],
            // ['USU_EMAIL', `raquelzinha${unique}@gmail.com.br`],
            ['END_RUA',`Rua Paraibense`],
            ['END_BAIRRO',`Jardim Santa Luzia`],
            ['CID_DESCRICAO','Santana do Sul'],
            ['EST_SIGLA', 'SP']
        ]

        test.each(camposParaAtualizar)(
            'deve atualizar o campo %s com sucesso',
            async (campo, novoValor) => {
                const response = await request(app)
                .post(`${API_USUARIO}/perfil/${campo}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ valor: novoValor });
                
                expect(response.status).toBe(200);
                expect(response.body).toEqual({ message: `Campo ${campo} atualizado com sucesso!` });
            }
        )

        test('deve falhar ao tentar atualizar um campo inválido', async () => {
            const response = await request(app)
                .post(`${API_USUARIO}/perfil/CAMPO_QUE_NAO_EXISTE`)
                .set('Authorization', `Bearer ${token}`)
                .send({ valor: 'qualquer valor' });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({  message: "Erro ao tentar atualizar o campo." });
        });
        
        test('deve falhar ao tentar atualizar o campo do perfil', async () => {
            const response = await request(app)
                .post(`${API_USUARIO}/perfil/PES_NOME`)
                .set('Authorization', `Bearer ${token}`)
                .send({ nome: 'Raquel' });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({  message: "Erro ao tentar atualizar o campo." });
        });
            
        test('deve retornar 401 se não houver token', async () => {
            const response = await request(app)
                .post(`${API_USUARIO}/perfil/PES_NOME`)
                .send({ nome: 'Novo Nome' });

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ message: 'Token não fornecido' });
        });
    });

})
