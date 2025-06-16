import log from '../utils/logger.js'
import UserService from '../service/UserService.js'

class UserController {
    async cadastrarUsuario(req, res) {
        log('INFO', 'UserController', 'cadastrarUsuario', 'INICIO')
        try {            
            await UserService.validarUsuario(req.body)
            log('INFO', 'UserController', 'cadastrarUsuario', 'FIM bem sucedido')
            return res.status(200).json({message: "Usuario cadastrado com sucesso" })            
        } catch (error) {
            log('ERROR','UserController','cadastrarUsuario','Falha ao cadastrar usuario', error)
            return res.status(500).json({message: "Erro interno do servidor", error})            
        }        
    }

    async logarUsuario(req, res){
        log('INFO', 'UserController', 'logarUsuario', 'INICIO')
        try {            
            const token = await UserService.validarLogin(req.body);
            console.log("TOKEN NA CONTROLLER ", token);
            log('INFO', 'UserController', 'cadastrarUsuario', 'FIM bem sucedido')
            return res.status(200).json({message: "Usuario cadastrado com sucesso", token })
        } catch (error) {
            log('ERROR', 'UserController', 'logarUsuario', 'Falha ao logar usuario', error)
            console.log(error);
            return res.status(500).json({message: "Erro interno do servidor", error})
        }
    }

    async solicitarNovaSenha(req, res){
        log('INFO', 'UserController', 'solicitarNovaSenha', 'INICIO')
        try {
            await UserService.gerarTokenSenha(req.body);
            log('INFO', 'UserController', 'solicitarNovaSenha', 'SUCESSO')
            return res.status(200).json({message: "Email enviado! Verifique a sua caixa de spam, se necessário", success: true})
        } catch (error) {
            log('ERROR', 'UserController', 'solicitarNovaSenha', 'ERRO AO TENTAR GERAR TOKEN')
            console.log(error);
            return res.status(500).json({ error: "Ocorreu um erro interno. Por favor, tente novamente mais tarde." })
        }
    }

}

export default new UserController;