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

  async pegarPostsPorCategoria(req, res){  
    try {
      log('INFO', 'PostController', 'pegarPostsPorCategoria', 'INICIO');
      const posts = await PostService.capturarPublicacoesPorCategoria(req.params.categoria, req.user.id);
      log('INFO', 'PostController', 'pegarPostsPorCategoria', 'FIM');
      return res.status(200).json({ message: "Posts capturados com sucesso", posts });
    } catch (error) {
      log('ERRO', 'PostController', 'pegarPostsPorCategoria', 'Erro ao capturar por categoria');
      console.log(error);
      if ( error instanceof HttpError  ) {        
        log('ERRO', 'PostController', 'pegarPostsPorCategoria', 'IF HTTP-ERROR');
        return res.status(error.status).json({error: error.message})
      }
      return res.status(500).json({ error: error.message });
    }
  }

  async pegarPostsPorTextoPesquisado(req, res){
    log('INFO', 'PostController', 'pegarPostsPorTextoPesquisado', 'INICIO');
    try {
      const termoBuscado = req.query.q;
      const posts = await PostService.buscarPostsPorTexto(termoBuscado);
      log('INFO', 'PostController', 'pegarPostsPorTextoPesquisado', 'FIM');
      return res.status(200).json({ message: "Posts encontrados com sucesso", posts });
    } catch (error) {
      log('ERRO', 'PostController', 'pegarPostsPorTextoPesquisado', 'Erro ao buscar posts por texto');
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }

  async pegarPostsProximidade(req, res) {
    log('INFO', 'PostController', 'pegarPostsProximidade', 'INICIO');
    try {
      
      const lat = parseFloat(req.query.lat);
      const lng = parseFloat(req.query.lng);
      const raioKm = parseFloat(req.query.raio || 4);

      const consulta = await PostService.buscarPostsPorProximidade(lat, lng, raioKm);
      log('INFO', 'PostController', 'pegarPostsProximidade', 'FIM');
      return res.status(200).json({ 
        messagem: "Posts encontrados com sucesso", consulta, radius: raioKm
      });
    } catch (error) {
      log('ERRO', 'PostController', 'pegarPostsProximidade', 'Erro ao buscar posts por proximidade');
      console.log(error);
      if (error instanceof HttpError) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async deletarPublicacao(req, res){
    log('INFO', 'PostController', 'deletarPublicacao', 'INICIO');
    try {
      await PostService.deletarDadosPost(req.params)
      return res.status(200).json({ message: `PUBLICAÇÃO excluido com sucesso! `});
    } catch (error) {
      log('ERRO', 'PostController', 'deletarPublicacao', 'ERRO ao deletar publicação');
      console.log(error);
      if (error instanceof HttpError) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({
        message: "Erro ao deletar a publicação",
        error: error.message
      });
      
    }
  }

}

export default new PostController();