import log from '../utils/logger.js'
import AdmModel from '../model/AdmModel.js'
import UserModel from '../model/UserModel.js'
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
}

export default new AdmService();