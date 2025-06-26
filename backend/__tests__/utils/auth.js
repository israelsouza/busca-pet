import request from 'supertest';
import app from '../../app.js';

export const gerarAuthToken = async () => {
    const email = 'raquelzinha1750908994465@gmail.com.br';
    const password = '123123';

    const response = await request(app)
        .post('/api/usuario/login')
        .send({
            email: email,
            password: password
        });

    if (response.status !== 200 || !response.body.token || !response.body.token.token) {
        console.error('Falha ao fazer login para obter token. Resposta:', response.body);
        throw new Error('Não foi possível obter o token para os testes. Verifique as credenciais do usuário de teste e a implementação da rota de login.');
    }

    console.log('Token de autenticação obtido com sucesso:');
    console.log(response.body);

    return response.body.token.token;
};
