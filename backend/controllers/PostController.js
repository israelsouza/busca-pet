import PostService from '../service/PostService.js'
import log from '../utils/logger.js'
import HttpError from '../utils/HttpError.js';

class PostController {
  async cadastrarUmPet(req, res){
    log('INFO', 'PostController', 'cadastrarUmPet', 'INICIO');
    try {
      await PostService.cadastrarPet(req.body, req.file, req.user);
      return res.status(201).json({message: "Pet cadastrado com sucesso"})  
    } catch (error) {
      log('ERRO', 'PostController', 'cadastrarUmPet', 'Erro ao cadastrar pet');
      console.log(error);        
      if ( error instanceof HttpError  ) {        
        log('ERRO', 'PostController', 'cadastrarUmPet', 'IF HTTP-ERROR');
        return res.status(error.status).json({error: error.message})
      }
      return res.status(500).json({message: "Erro interno do servidor"})      
    }
  }

  async pegarMinhasPublicacoes(req, res) {
    log('INFO', 'PostController', 'pegarMinhasPublicacoes', 'INICIO');
    try {
      const meusPosts = await PostService.capturarPublicacoes(req.user.id)
      log('INFO', 'PostController', 'pegarMinhasPublicacoes', 'FIM');
      return res.status(200).json({message:"Ok", meusPosts})
    } catch (error) {
      log('ERROR', 'PostController', 'pegarMinhasPublicacoes', 'Erro ao buscar publicações');
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new PostController();