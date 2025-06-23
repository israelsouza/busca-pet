import log from '../utils/logger.js'
import AdmModel from '../model/AdmModel.js'

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
}

export default new AdmService();