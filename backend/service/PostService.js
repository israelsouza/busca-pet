import ValidationUtils from '../utils/ValidationUtils.js'
import PostModel from '../model/PostModel.js'
import log from '../utils/logger.js'
import HttpError from '../utils/HttpError.js';

class PostService {
    async cadastrarPet(data, img, {id}){
        log('INFO', 'PostService', 'cadastrarPet', 'INICIO');
        await this.validacaoDadosPet(data);
        // verificar se img ultrapassa os 10MB
        await this.salvarPet(data, img, id)
        log('INFO', 'PostService', 'cadastrarPet', 'FIM');
    }
    
    async validacaoDadosPet(data){
        log('INFO', 'PostService', 'validacaoPet', 'INICIO');
        
        if ( data.categoria === 'perdido' ) {
            log('INFO', 'PostService', 'validacaoPet', 'Apenas valida nome e RGA');
            ValidationUtils.validarCampoObrigatorio(data.nome, 'nome do pet')
            ValidationUtils.validarTamanho(data.nome, 'nome-pet')
            // validação RGA
        }
        
        ValidationUtils.validarCampoObrigatorio(data.tipoPet, 'tipo-pet')
        ValidationUtils.validarCampoObrigatorio(data.descricao, 'descrição')
        ValidationUtils.validarCampoObrigatorio(data.data, 'data') 
        
        ValidationUtils.validarTamanho(data.tipoPet, 'tipo-pet')
        ValidationUtils.validarTamanho(data.descricao, 'descrição')
        ValidationUtils.validarTamanho(data.data, 'data')
        
        data.data = ValidationUtils.formatarDataParaDDMMYYYY(data.data)
        log('INFO', 'PostService', 'validacaoPet', 'FIM');
    }

    async salvarPet(data, img, userId){
        log('INFO', 'PostService', 'salvarPet', 'INICIO');
        try {
            await PostModel.criarPublicacao(data, img, userId)
            log('INFO', 'PostService', 'salvarPet', 'FIM');
        } catch (error) {
            console.log(error);
            throw new HttpError(400, `Erro ao salvar no banco: ${error}`)
        }
    }

    async capturarPublicacoes(id){
        return await PostModel.listarPostsPorUsuario(id);
    }
}

export default new PostService();