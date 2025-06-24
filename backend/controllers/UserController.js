import log from '../utils/logger.js'
import UserService from '../service/UserService.js'
import TokenService from '../service/TokenService.js'
import HttpError from '../utils/HttpError.js';

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

    async verificarToken(req, res){
        log('INFO', 'UserController', 'verificarToken', 'INICIO')
        try {
            const token = await TokenService.validarToken(req.body);
            log('INFO', 'UserController', 'verificarToken', 'FIM')
            return res.status(200).json({ mensagem: "Token válido.", usu_id: token.USU_ID, success: true });

        } catch (error) {

            log('ERRO', 'UserController', 'verificarToken', 'ERRO AO VERIFICAR TOKEN')
            console.log(error);
            return res.status(500).json({ erro: "Erro interno ao validar o token." });
            
        }
    }

    async submeterNovaSenha(req, res){
        log('INFO', 'UserController', 'submeterNovaSenha', 'INICIO')
        try {
            await UserService.atualizarSenha(req.body);
            log('INFO', 'UserController', 'submeterNovaSenha', 'FIM')
            return res.status(200).send({ message: "Sucesso, senha atualizada. Realize o login.", success: true });
        } catch (error) {

            log('ERRO', 'UserController', 'submeterNovaSenha', 'ERRO AO SALVAR SENHA')
            console.log(error);
            return res.status(400).send({message: "Erro ao tentar atualizar a senha. Tente novamente"})
            
        }
    }

    async pegarFotoPerfil(req, res){
        log('INFO', 'UserController', 'pegarFotoPerfil', 'INICIO')
        try {
            const foto = await UserService.obterFotoPerfilUsuario(req.user.id);
            log('INFO', 'UserController', 'pegarFotoPerfil', 'FIM')
            return res.status(200).json({foto})
        } catch (error) {
            log('ERRO', 'UserController', 'pegarFotoPerfil', 'ERRO AO BUSCAR FOTO')
            console.log(error);            
            return res.status(400).json({ message: "Erro ao tentar pegar sua foto, atualize a página" });            
        }
    }

    async pegarFotoPerfilComNome(req, res){
        log('INFO', 'UserController', 'pegarFotoPerfil', 'INICIO')
        try {
            const foto = await UserService.obterFotoPerfilUsuarioComNome(req.user.id);
            log('INFO', 'UserController', 'pegarFotoPerfil', 'FIM')
            return res.status(200).json({ foto })
        } catch (error) {
            log('ERRO', 'UserController', 'pegarFotoPerfil', 'ERRO AO BUSCAR FOTO')
            console.log(error);            
            return res.status(400).json({ message: "Erro ao tentar pegar sua foto, atualize a página" });            
        }
    }

    async pegarUsuariosEDenuncias(req, res){
        log('INFO', 'AdmController', 'pegarUsuariosEDenuncias', 'INICIO')
        try {
            const usuarios = await UserService.listarUsuariosEDenuncias()
            log('INFO', 'AdmController', 'pegarUsuariosEDenuncias', 'FIM')
            return res.status(200).json({usuarios});
        } catch (error) {
            log('ERRO', 'AdmController', 'pegarUsuariosEDenuncias', 'ERRO ao buscar usuarios e denuncias')
            console.log(error);      
            return res.status(500).json({ 
                message: "Erro ao buscar usuários", error: error.message
            });
        }
    }

    async atualizarDadoUsuario(req, res){
        log('INFO', 'AdmController', 'atualizarDadoUsuario', 'INICIO');
        try {
            await UserService.atualizarDadoUsuario(req.params, req.body);

            log('INFO', 'AdmController', 'atualizarDadoUsuario', 'FIM');
            return res.status(200).json({ 
                message: "Usuário atualizado com sucesso!"
            });
        } catch (error) {
            log('ERRO', 'AdmController', 'atualizarDadoUsuario', 'ERRO ao atualizar dados do usuário');
            console.log(error);
            if (error instanceof HttpError) {
                return res.status(error.status).json({ error: error.message });
            }
            return res.status(500).json({
                message: "Erro ao atualizar os dados do usuário",
                error: error.message
            });
        }
    }

    async banirUsuario(req, res){
        log('INFO', 'AdmController', 'banirUsuario', 'INICIO');
        try {      
            const result = await UserService.banirUsuario(req.body);      
            log('INFO', 'AdmController', 'banirUsuario', 'FIM');
            return res.status(200).json({ message: "Usuário banido com sucesso!", data: result });
        } catch (error) {
            log('ERRO', 'AdmController', 'banirUsuario', 'ERRO ao banir usuário');
            console.log(error);
            if (error instanceof HttpError) {
                return res.status(error.status).json({ error: error.message });
            }
            return res.status(500).json({
                message: "Erro ao banir o usuário",
                error: error.message
            });
        }
    }

    async pegarDadosUsuario(req, res){
        log('INFO', 'UserController', 'pegarDadosUsuario', 'INICIO')
        try {
            const userData = await UserService.obterDadosUsuario(req.user.id);
            log('INFO', 'UserController', 'pegarDadosUsuario', 'FIM')
            return res.status(200).json({
                message: "Dados cadastrais obtidos com sucesso!",
                userData,
            })
        } catch (error) {
            log('ERRO', 'UserController', 'pegarDadosUsuario', 'ERRO AO BUSCAR OS DADOS DO USUARIO')
            console.log(error);            
            return res.status(400).json({ 
                message: "Erro ao tentar pegar seus dados, atualize a página"
            });     
        }
    }

    async atualizarCampo(req, res){
        log('INFO', 'UserController', 'atualizarCampo', 'INICIO')
        try {
            await UserService.atualizarCampoUsuario(req.user.id, req.body, req.params.campo);
            log('INFO', 'UserController', 'atualizarCampo', 'FIM')
            return res.status(200).json({ 
                message: `Campo ${req.params.campo} atualizado com sucesso!`
             });
        } catch (error) {
            log('ERRO', 'UserController', 'atualizarCampo', 'ERRO AO ATUALIZAR CAMPO', error)
            console.log(error);
            return res.status(400).json({ 
                message: "Erro ao tentar atualizar o campo."
             });
        }
    }

    async atualizarFotoPerfil(req, res){
        log('INFO', 'UserController', 'atualizarFotoPerfil', 'INICIO')
        try {
            await UserService.atualizarFotoPerfilUsuario(req.user.id, req.file.buffer);
            log('INFO', 'UserController', 'atualizarFotoPerfil', 'FIM')
            return res.status(200).json({ 
                message: "Foto de perfil atualizada com sucesso!"
            });
        } catch (error) {
            log('ERRO', 'UserController', 'atualizarFotoPerfil', 'ERRO AO ATUALIZAR FOTO', error)
            console.log(error);
            return res.status(400).json({ 
                message: "Erro ao tentar atualizar a foto de perfil."
            });
        }
    }

}

export default new UserController;