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
}

export default new AdmService();