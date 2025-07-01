import ValidationUtils from '../utils/ValidationUtils.js'
import PostModel from '../model/postModel.js'
import log from '../utils/logger.js'
import HttpError from '../utils/HttpError.js';

class PostService {
    async cadastrarPet(data, img, {id}){
        log('INFO', 'PostService', 'cadastrarPet', 'INICIO');
        await this.validacaoDadosPet(data);
        await this.salvarPet(data, img, id)
        log('INFO', 'PostService', 'cadastrarPet', 'FIM');
    }
    
    async validacaoDadosPet(data){
        log('INFO', 'PostService', 'validacaoPet', 'INICIO');
        
        if ( data.categoria === 'perdido' ) {
            log('INFO', 'PostService', 'validacaoPet', 'Apenas valida nome e RGA');
            ValidationUtils.validarCampoObrigatorio(data.nome, 'nome do pet')
            ValidationUtils.validarTamanho(data.nome, 'nome-pet')
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
        return await PostModel.listarPosts('meus', id);
    }

    async capturarPublicacoesPorCategoria(categoria, id=null){
        console.log(`Capturando publicações da categoria: '${categoria}'`);

        if (categoria !== 'Perdido' && categoria !== 'Encontrado' && categoria !== 'todos') {
            throw new HttpError(400, "Categoria inserida inválida, tente novamente")
        }
        
        log('INFO', 'PostService', 'capturarPublicacoesPorCategoria', 'INICIO');
        return await PostModel.listarPosts(categoria, id);
    }

    async buscarPostsPorTexto(termo){
        log('INFO', 'PostService', 'buscarPostsPorTexto', 'INICIO');
        ValidationUtils.validarCampoObrigatorio(termo, 'termo-buscado')
        const posts = await PostModel.buscarPostsPorTexto(termo);
        log('INFO', 'PostService', 'buscarPostsPorTexto', 'FIM');
        return posts;
    }

    async buscarPostsPorProximidade(lt, lg, raio){
        log('INFO', 'PostService', 'buscarPostsPorProximidade', 'INICIO');
        const posts = await PostModel.buscarPostsPorProximidade(lt, lg, raio);

        const postsFormatados = posts.map( (row) => ({
            ...row,
            PET_FOTO: row.PET_FOTO
            ? `data:image/jpeg;base64,${row.PET_FOTO.toString("base64")}`
            : null,
            PET_DATA: row.PET_DATA
            ? ValidationUtils.formatarDataParaDDMMYYYY(
                new Date(row.PET_DATA).toISOString().split("T")[0]
            )
            : null,
        }))

        log('INFO', 'PostService', 'buscarPostsPorProximidade', 'FIM');
        return postsFormatados;
    }

    async deletarDadosPost({id}){
        log('INFO', 'PostService', 'deletarDadosPost', 'INICIO');
        if (!ValidationUtils.validarID(id) ) throw new HttpError(400, "ID do POST inválido");

        try {
            await PostModel.deletarDadosPostIndividual(id)
        } catch (error) {
            
        }
    }
}

export default new PostService();