import log from '../utils/logger.js'
import AdmModel from '../model/AdmModel.js'
import UserModel from '../model/UserModel.js'
import UserService from '../service/UserService.js'
import ValidationUtils from '../utils/ValidationUtils.js'
import { templateEmailBanir } from "../configs/myEmail.js";
import transporter from "../configs/mailConfig.js";
import HttpError from '../utils/HttpError.js';

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

    async deletarDadosPost({id}){
        log('INFO', 'AdmService', 'deletarDadosPost', 'INICIO');
        if (!ValidationUtils.validarID(id) ) throw new HttpError(400, "ID do POST inválido");

        try {
            await AdmModel.deletarDadosPostIndividual(id)
        } catch (error) {
            
        }
    }
}

export default new AdmService();