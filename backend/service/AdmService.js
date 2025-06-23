import log from '../utils/logger.js'
import AdmModel from '../model/AdmModel.js'
import UserModel from '../model/UserModel.js'
import UserService from '../service/UserService.js'
import ValidationUtils from '../utils/ValidationUtils.js'
import { templateEmailBanir } from "../configs/myEmail.js";
import transporter from "../configs/mailConfig.js";

class AdmService{
    async listarUsuariosEDenuncias(){
        log('INFO', 'AdmService', 'listarUsuariosEDenuncias', 'INICIO')
        try {
            const usuarios = await AdmModel.listarUsuariosEDenuncias()
            log('INFO', 'AdmService', 'listarUsuariosEDenuncias', 'FIM')
            return usuarios;
        } catch (error) {
            log('ERRO', 'AdmService', 'listarUsuariosEDenuncias', 'ERRO ao listar os usuarios')
            console.log(error);
            throw error;
        }
    }

    async listarDenuncias(){
        log('INFO', 'AdmService', 'listarDenuncias', 'INICIO')
        try {
            const denuncias = await AdmModel.listarDenuncias()
            log('INFO', 'AdmService', 'listarDenuncias', 'FIM')
            return denuncias;
        } catch (error) {
            log('ERRO', 'AdmService', 'listarDenuncias', 'ERRO ao listar as denuncias')
            console.log(error);
            throw error;
        }
    }

    async pegarPostDenunciado(id){
        log('INFO', 'AdmService', 'pegarPostDenunciado', 'INICIO')
        if ( !ValidationUtils.validarID(id) ) throw new HttpError(400, "ID da publicação inválido");
        try {
            const post = await AdmModel.listaPostDenunciado(id)
            if (post === null) throw new HttpError(400, "Publicação não encontrada");

            const postTratado = await ValidationUtils.tratarImagensEData(post)         
            log('INFO', 'AdmService', 'pegarPostDenunciado', 'POST TRATADO COM SUCESSO')
            log('INFO', 'AdmService', 'pegarPostDenunciado', 'FIM')

            return postTratado[0];
        } catch (error) {
            log('ERRO', 'AdmService', 'pegarPostDenunciado', 'ERRO ao listar a publicação denunciada')
            console.log(error);
            throw error;
        }
        
    }

    async atualizarStatusDenuncia({ idPost, status, idDenuncia }){
        log('INFO', 'AdmService', 'atualizarStatusDenuncia', 'INICIO')
        if (!status || !idDenuncia || !idPost) {
            throw new HttpError(400, 'Ação inválida ou não especificada.');
        }

        console.log("post ", idPost);
        console.log("idDenuncia ", idDenuncia);
        
        status == "MANTER" ? await this.manterPost(idDenuncia) : await this.deletarPost(idPost, idDenuncia);
    }

    async manterPost(id){
        try {
            log('INFO', 'AdmService', 'manterPost', 'INICIO')
            await AdmModel.manterPost(id);
            log('INFO', 'AdmService', 'manterPost', 'FIM')
        } catch (error) {
            log('ERRO', 'AdmService', 'manterPost', 'ERRO ao manter o post denunciado')
            console.log(error);
            throw error;
        }
    }

    async deletarPost(idPost, idDenuncia){
        try {
            log('INFO', 'AdmService', 'deletarPost', 'INICIO')
            await AdmModel.deletarPost(idPost, idDenuncia);
            log('INFO', 'AdmService', 'deletarPost', 'FIM')
        } catch (error) {
            log('ERRO', 'AdmService', 'deletarPost', 'ERRO ao excluir o post denunciado')
            console.log(error);
            throw error;
        }
    }

    async banirUsuario({id, email}){
        log('INFO', 'AdmService', 'banirUsuario', 'INICIO')
        try {

            if (!ValidationUtils.validarID(id) ) throw new HttpError(400, "ID do usuário inválido");
            if (!ValidationUtils.validarTamanho(email, 'email') ) throw new HttpError(400, "Tamanho do email inválido");
            if (!ValidationUtils.validarFormatoEmail(email) ) throw new HttpError(400, "Formato do email inválido");

            await AdmModel.banirUsuario(id);
            const nome = await UserModel.findNameById(id);
            
            await transporter.sendMail(
                templateEmailBanir(email, nome)
            );
            
            log('INFO', 'AdmService', 'banirUsuario', 'FIM')
        } catch (error) {
            log('ERRO', 'AdmService', 'banirUsuario', 'ERRO ao banir o usuário')
            console.log(error);
            throw error;
        }
    }

    /**
     * @param {object} dadosUsuario - Os dados do usuário a serem atualizados.
     * @param {string} [dadosUsuario.nome] - O novo nome do usuário. Validações interessantes incluem verificar se não é uma string vazia e se possui um comprimento mínimo/máximo.
     * @param {string} [dadosUsuario.email] - O novo email do usuário. É importante validar o formato do email e, principalmente, verificar se o novo email já não está cadastrado por outro usuário para evitar duplicidade.
     * @param {string} [dadosUsuario.senha] - A nova senha do usuário. A validação deve focar na força da senha (comprimento mínimo, caracteres especiais, números, etc.). A senha nunca deve ser salva como texto plano, e sim como um hash.
     * @throws {Error} Lança um erro se o usuário com o ID fornecido não for encontrado ou se os dados fornecidos forem inválidos.
     */
    async atualizarDadoUsuario({id}, {nome, email, senha}){
        log('INFO', 'AdmService', 'atualizarDadoUsuario', 'INICIO')
        try {
            if (!nome && !email && !senha)
                throw new HttpError(400, "Preencha ao menos um campo")

            if (!ValidationUtils.validarID(id) ) throw new HttpError(400, "ID do usuário inválido");
            if (!(await UserModel.findNameById(id)) ) throw new HttpError(400, "Usuário não existe");

            const valores = {}

            if (nome) {
                if (!UserService.validarTamanho(nome, 'nome') ) throw new HttpError(400, "Tamanho do nome ultrapassa o limite");
                if (!UserService.validarTextoSemNumero(nome) ) throw new HttpError(400, "Nome não pode conter números");
                valores.nome = nome;
            }

            if (email) {
                if (!UserService.validarTamanho(email, 'email') ) throw new HttpError(400, "Tamanho do email ultrapassa o limite");
                if (!UserService.validarFormatoEmail(email) ) throw new HttpError(400, "Formato do email inválido");
                valores.email = email;
            }

            let novaSenha;
            if (senha) {
                if (!UserService.validarTamanho(senha, 'senha') ) throw new HttpError(400, "Tamanho da senha ultrapassa o limite");
                novaSenha = await UserService.criptografarSenha(senha)
                valores.senha = novaSenha;
            }

            await AdmModel.atualizarUsuario(id, valores);

            log('INFO', 'AdmService', 'atualizarDadoUsuario', 'FIM, usuário atualizado com sucesso')

        } catch (error) {

            log('ERRO', 'AdmService', 'atualizarDadoUsuario', 'ERRO ao atualizar os dados do usuário')
            console.log(error);
            throw error;
            
        }
    }
}

export default new AdmService();