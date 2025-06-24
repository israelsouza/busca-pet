import log from '../utils/logger.js'
import bcrypt from 'bcrypt'
import UserModel from '../model/UserModel.js'
import TokenService from '../service/TokenService.js'
import HttpError from '../utils/HttpError.js';
import ValidationUtils from '../utils/ValidationUtils.js';
import { templateEmailBanir } from "../configs/myEmail.js";
import transporter from "../configs/mailConfig.js";

class UserService {
    static MENSAGEM_NAO_CONTEM_NUMERO = 'inválido, só pode conter letras e espaços';
    static MENSAGEM_SO_CONTEM_NUMERO = 'inválido, só pode conter números';

    async validarUsuario({nome, email, senha, telefone, rua, bairro, cep, cidade, estado}){

        log('INFO', 'UserService', 'validarUsuario', 'INICIO')

        if( !this.validarCamposObrigatorios(nome, 'nome') ) throw error ;
        if( !this.validarCamposObrigatorios(email, 'email') ) throw error ;
        if( !this.validarCamposObrigatorios(senha, 'senha') ) throw error ;
        if( !this.validarCamposObrigatorios(telefone, 'telefone') ) throw error ;
        if( !this.validarCamposObrigatorios(rua, 'rua') ) throw error ;
        if( !this.validarCamposObrigatorios(bairro, 'bairro') ) throw error ;
        if( !this.validarCamposObrigatorios(cep, 'cep') ) throw error ;
        if( !this.validarCamposObrigatorios(cidade, 'cidade') ) throw error ;
        if( !this.validarCamposObrigatorios(estado, 'estado') ) throw error ;

        if( !this.validarTamanho(nome, 'nome') ) throw error ;
        if( !this.validarTamanho(email, 'email') ) throw error ;
        if( !this.validarTamanho(senha, 'senha') ) throw error ;
        if( !this.validarTamanho(telefone, 'telefone') ) throw error ;
        if( !this.validarTamanho(rua, 'rua') ) throw error ;
        if( !this.validarTamanho(bairro, 'bairro') ) throw error ;
        if( !this.validarTamanho(cep, 'cep') ) throw error ;
        if( !this.validarTamanho(cidade, 'cidade') ) throw error ;
        if( !this.validarTamanho(estado, 'estado') ) throw error ;        

        if ( !this.validarTextoSemNumero(nome) ) throw new Error(`Nome ${this.MENSAGEM_NAO_CONTEM_NUMERO}`);        
        if ( !this.validarTextoSemNumero(rua) ) throw new Error(`Rua ${this.MENSAGEM_NAO_CONTEM_NUMERO}`);
        if ( !this.validarTextoSemNumero(cidade) ) throw new Error(`Cidade ${this.MENSAGEM_NAO_CONTEM_NUMERO}`);
        if ( !this.validarTextoSemNumero(estado) ) throw new Error(`Estado ${this.MENSAGEM_NAO_CONTEM_NUMERO}`);

        if ( !this.validarApenasNumeros(telefone) ) throw new Error(`Telefone ${this.MENSAGEM_SO_CONTEM_NUMERO}`);
        if ( !this.validarApenasNumeros(cep) ) throw new Error(`CEP ${this.MENSAGEM_SO_CONTEM_NUMERO}`);
        
        if( !this.validarFormatoEmail(email) ) throw new Error("Formato do e-mail inválido");
        
        if( !this.validarSiglaEstado(estado) ) throw new Error("Siglas do estado inválidas");

        try {        
            senha = await this.criptografarSenha(senha);
            const result = await this.salvarDados({nome, email, senha, telefone, rua, bairro, cep, cidade, estado});
            log('INFO', 'UserService', 'validarUsuario', 'FIM com sucesso')
            return result;
        } catch (error) {
            log('ERROR', 'UserService', 'validarUsuario', 'Falha na criação do usuário')
            console.log(error);            
            throw error;
        }

    }

    async validarLogin({email, password}){
        log('INFO', 'UserService', 'validarLogin', 'INICIO')        

        if( !this.validarCamposObrigatorios(email, 'email') ) throw error ;
        if( !this.validarCamposObrigatorios(password, 'senha') ) throw error ;

        if( !this.validarTamanho(email, 'email') ) throw error ;
        if( !this.validarTamanho(password, 'senha') ) throw error ;

        if( !this.validarFormatoEmail(email) ) throw new Error("Formato do e-mail inválido");

        try {
            const userInfo = await this.realizarLogin({email, password});
            log('INFO', 'UserService', 'validarLogin', 'FIM')
            return userInfo;
        } catch (error) {
            log('ERROR', 'UserService', 'validarLogin', 'Falha no login do usuário')
            console.log(error);            
            throw error;
        }
    }

    async realizarLogin(dados){
        log('INFO', 'UserService', 'realizarLogin', 'INICIO')
        try { 
            const result = await UserModel.logarUsuario(dados)
            
            log('INFO', 'UserService', 'realizarLogin', 'COM SUCESSO SUCESSO')
            log('INFO', 'UserService', 'realizarLogin', 'GERANDO TOKEN')

            const token = TokenService.gerarTokenJWT(result);
            
            log('INFO', 'UserService', 'realizarLogin', 'FIM')
            return {token, id: result.userId, role: result.role, email: result.email};
            
        } catch (error) {
            log('ERRO', 'UserService', 'realizarLogin', 'AO TENTAR LOGAR USUARIO')
            console.log(error);            
            throw error;
        }
    }

    async criptografarSenha(senha){
        log('INFO', 'UserService', 'criptografarSenha', 'INICIO');
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(senha, salt);
            log('INFO', 'UserService', 'criptografarSenha', 'FIM');
            return hash;
        } catch (error) {
            log('ERROR', 'UserService', 'criptografarSenha', error.message);
            throw new Error('Erro ao criptografar a senha');
        }
    }

    async salvarDados(dados){
        log('INFO', 'UserService', 'salvarDados', 'INICIO')
        try { 
            const result = await UserModel.salvarUsuario(dados)  
        } catch (error) {
            throw error;
        }
    }

    async gerarTokenSenha({email}){
        log('INFO', 'UserService', 'gerarTokenSenha', 'INICIO')
        this.validarCamposObrigatorios(email, 'email');
        this.validarFormatoEmail(email);
        this.validarTamanho(email, 'email');
        
        try {
            const id = await UserModel.pegarIdUsuarioPeloEmail(email);
            if (!id) {
                log('ERRO', 'UserService', 'gerarTokenSenha', 'USUARIO NÃO ENCONTRADO NO BANCO DE DADOS')
                throw new Error("Usuário não encontrado no banco de dados");
            }
    
            log('INFO', 'UserService', 'gerarTokenSenha', 'ID CAPTURADO')
            
            await TokenService.criarTokenSenha(id, email);
            
            log('INFO', 'UserService', 'gerarTokenSenha', 'FIM')

            return true;
        } catch (error) {

            log('ERRO', 'UserService', 'gerarTokenSenha', 'ERRO AO TENTAR GERAR O TOKEN')
            console.log(error);
            return false;           
            
        }
    }

    validarTextoSemNumero(valor){
        log('INFO', 'UserService', 'validarTextoSemNumero', 'INICIO')
        if ( !valor || typeof valor !== "string" ) return false;
        valor = valor.trim();
        const regex =  /^[a-zA-ZÀ-ÿ\s'-]+$/;
        log('INFO', 'UserService', 'validarTextoSemNumero', 'FIM')
        return regex.test(valor);
    }

    validarApenasNumeros(valor){
        log('INFO', 'UserService', 'validarApenasNumeros', 'INICIO')
        if ( !valor ) return false;
        if (typeof valor === "number") return true;
        if (typeof valor === "string") {
            valor = valor.trim();
            const regex = /^[0-9]+$/;
            return regex.test(valor);
        }
        return false;
    }

    validarTamanho(valor, campo){
        log('INFO', 'UserService', 'validarTamanho', 'INICIO')
        switch (campo) {
            case "nome":
                if (valor.length > 70) throw new Error("Tamanho máximo excedido!");
                break;
            case "email":
                if (valor.length > 70) throw new Error("Tamanho máximo excedido!");
                break;

            case "senha":
                if (valor.length < 6) throw new Error("Tamanho menor que o mínimo exigido!");
                if (valor.length > 30) throw new Error("Tamanho máximo excedido!");
                break;
            
            case "telefone":
                if (valor.length !== 11) throw new Error("Tamanho diferente do padrão!");
                break;

            case "rua":
                if (valor.length > 120) throw new Error("Tamanho máximo excedido!");
                break;

            case "bairro":
                if (valor.length > 120) throw new Error("Tamanho máximo excedido!");
                break;

            case "cep":
                if (valor.length !== 8) throw new Error("Tamanho diferente do padrão!");
                break;

            case "cidade":
                if (valor.length > 35) throw new Error("Tamanho máximo excedido!");
                break;

            case "estado":
                if (valor.length !== 2) throw new Error("Tamanho diferente do padrão!");
                break;
        
            default:
                throw new Error("Campo inconclusivo, tente novamente");
                break;                
        }

        log('INFO', 'UserService', 'validarTamanho', 'FIM')
        return true;
    }

    validarFormatoEmail(email){
        log('INFO', 'UserService', 'validarFormatoEmail', 'INICIO')
        const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        log('INFO', 'UserService', 'validarFormatoEmail', 'FIM')
        return emailRegex.test(email);
    }

    validarSiglaEstado(estado){
        log('INFO', 'UserService', 'validarSiglaEstado', 'INICIO')
        const estadosValidos = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
        if (!estadosValidos.includes(estado)) throw new Error("Estado inválido.");
        log('INFO', 'UserService', 'validarSiglaEstado', 'FIM')
        return true;
    }

    validarCamposObrigatorios(valor, campo){
        log('INFO', 'UserService', 'validarCamposObrigatorios', 'INICIO')
        if( !valor ) throw new Error(`O campo ${campo} é obrigatório`);
        if (campo !== "senha") valor = valor.trim();
        log('INFO', 'UserService', 'validarCamposObrigatorios', 'FIM')
        return valor;
    }

    async atualizarSenha({password, email}){
        log('INFO', 'UserService', 'atualizarSenha', 'INICIO')
        if ( !this.validarCamposObrigatorios(password) ) throw new Error("O campo senha é obrigatório");
        if ( !this.validarCamposObrigatorios(email) ) throw new Error("O e-mail não foi preenchido");
        
        if( !this.validarTamanho(email, 'email') ) throw error ;
        if( !this.validarTamanho(password, 'senha') ) throw error ;
        
        if( !this.validarFormatoEmail(email) ) throw new Error("Formato do e-mail inválido");
        
        log('INFO', 'UserService', 'atualizarSenha', 'VALIDAÇÕES FEITAS')
        try {
            const senha = await this.criptografarSenha(password);
            const atualizada = await UserModel.salvarSenha(senha, email);
            
            log('INFO', 'UserService', 'atualizarSenha', 'SENHA SALVA')
            log('INFO', 'UserService', 'atualizarSenha', 'FIM')
            return true;

        } catch (error) {

            log('ERRO', 'UserService', 'atualizarSenha', 'ERRO AO TENTAR SALVAR A SENHA')
            console.log(error);
            return false; 
            
        }
    }

    async obterFotoPerfilUsuario(id){
        log('INFO', 'UserService', 'obterFotoPerfilUsuario', 'INICIO')
        if ( !ValidationUtils.validarID(id) ) throw new HttpError(400, "ID do usuário inválido");

        try {
            return await UserModel.buscarfotoUsuario(id);
        } catch (error) {
            log('ERROR', 'UserService', 'obterFotoPerfilUsuario', "ERRO ao obter a foto");
            console.log(error)            
            throw error;
        }
    }

    async obterFotoPerfilUsuarioComNome(id){
        log('INFO', 'UserService', 'obterFotoPerfilUsuario', 'INICIO')
        if ( !ValidationUtils.validarID(id) ) throw new HttpError(400, "ID do usuário inválido");

        try {
            return await UserModel.buscarfotoUsuarioComNome(id);
        } catch (error) {
            log('ERROR', 'UserService', 'obterFotoPerfilUsuario', "ERRO ao obter a foto");
            console.log(error)            
            throw error;
        }
    }

    async listarUsuariosEDenuncias(){
        log('INFO', 'AdmService', 'listarUsuariosEDenuncias', 'INICIO')
        try {
            const usuarios = await UserModel.listarUsuariosEDenuncias()
            log('INFO', 'AdmService', 'listarUsuariosEDenuncias', 'FIM')
            return usuarios;
        } catch (error) {
            log('ERRO', 'AdmService', 'listarUsuariosEDenuncias', 'ERRO ao listar os usuarios')
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
                if (!this.validarTamanho(nome, 'nome') ) throw new HttpError(400, "Tamanho do nome ultrapassa o limite");
                if (!this.validarTextoSemNumero(nome) ) throw new HttpError(400, "Nome não pode conter números");
                valores.nome = nome;
            }

            if (email) {
                if (!this.validarTamanho(email, 'email') ) throw new HttpError(400, "Tamanho do email ultrapassa o limite");
                if (!this.validarFormatoEmail(email) ) throw new HttpError(400, "Formato do email inválido");
                valores.email = email;
            }

            let novaSenha;
            if (senha) {
                if (!this.validarTamanho(senha, 'senha') ) throw new HttpError(400, "Tamanho da senha ultrapassa o limite");
                novaSenha = await this.criptografarSenha(senha)
                valores.senha = novaSenha;
            }

            await UserModel.atualizarUsuario(id, valores);

            log('INFO', 'AdmService', 'atualizarDadoUsuario', 'FIM, usuário atualizado com sucesso')

        } catch (error) {

            log('ERRO', 'AdmService', 'atualizarDadoUsuario', 'ERRO ao atualizar os dados do usuário')
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

            await UserModel.banirUsuario(id);
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

    async obterDadosUsuario(id){
        log('INFO', 'UserService', 'obterDadosUsuario', 'INICIO')
        if ( !ValidationUtils.validarID(id) ) throw new HttpError(400, "ID do usuário inválido");

        try {
            return await UserModel.listarDadosUsuario(id);
        } catch (error) {
            log('ERROR', 'UserService', 'obterDadosUsuario', "ERRO ao obter os dados do usuário");
            console.log(error)            
            throw error;
        }
    }

    async atualizarCampoUsuario(id, {valor}, campo){
        log('INFO', 'UserService', 'atualizarCampoUsuario', 'INICIO');

        if (!ValidationUtils.validarID(id)) 
            throw new HttpError(400, "ID do usuário inválido");

        if (!campo || typeof campo !== 'string')
            throw new HttpError(400, "Campo a ser atualizado é inválido ou não foi fornecido.");

        try {
            
            await this.processarValidacoesCampos(valor, campo)

            log('INFO', 'UserService', 'atualizarCampoUsuario', `VALIDAÇÕES PARA O CAMPO '${campo}' FEITAS`);

            await UserModel.atualizarCampoUsuario(id, campo, valor);

            log('INFO', 'UserService', 'atualizarCampoUsuario', 'FIM com sucesso');
            return { message: `Campo '${campo}' atualizado com sucesso.` };

        } catch (error) {
            log('ERROR', 'UserService', 'atualizarCampoUsuario', `ERRO ao atualizar o campo '${campo}'`);
            console.log(error);
            throw error;
        }
    }

    async processarValidacoesCampos(valor, campo) {
        switch (campo) {
            case 'PES_NOME':
                this.validarCamposObrigatorios(valor, 'nome');
                this.validarTamanho(valor, 'nome');
                if (!this.validarTextoSemNumero(valor)) throw new Error(`Nome ${UserService.MENSAGEM_NAO_CONTEM_NUMERO}`);
                break;
            case 'PES_PHONE':
                this.validarCamposObrigatorios(valor, 'telefone');
                this.validarTamanho(valor, 'telefone');
                if (!this.validarApenasNumeros(valor)) throw new Error(`Telefone ${UserService.MENSAGEM_SO_CONTEM_NUMERO}`);
                break;
            case 'USU_EMAIL':
                this.validarCamposObrigatorios(valor, 'email');
                this.validarTamanho(valor, 'email');
                this.validarFormatoEmail(valor)
                break;
            case 'END_RUA':
                this.validarCamposObrigatorios(valor, 'rua');
                this.validarTamanho(valor, 'rua');
                if (!this.validarTextoSemNumero(valor)) throw new Error(`Rua ${UserService.MENSAGEM_NAO_CONTEM_NUMERO}`);
                break;
            case 'END_BAIRRO':
                this.validarCamposObrigatorios(valor, 'bairro');
                this.validarTamanho(valor, 'bairro');
                break;
            case 'CID_DESCRICAO':
                this.validarCamposObrigatorios(valor, 'cidade');
                this.validarTamanho(valor, 'cidade');
                if (!this.validarTextoSemNumero(valor)) throw new Error(`Cidade ${UserService.MENSAGEM_NAO_CONTEM_NUMERO}`);
                break;
            case 'EST_SIGLA':
                this.validarCamposObrigatorios(valor, 'estado');
                this.validarTamanho(valor, 'estado');
                if (!this.validarTextoSemNumero(valor)) throw new Error(`Estado ${UserService.MENSAGEM_NAO_CONTEM_NUMERO}`);
                this.validarSiglaEstado(valor);
                break;
            default:
                throw new HttpError(400, `O campo '${campo}' não é permitido para atualização.`);
        }
    }

    async atualizarFotoPerfilUsuario(id, binario){
        log('INFO', 'UserService', 'atualizarFotoPerfilUsuario', 'INICIO');
        
        if (!ValidationUtils.validarID(id)) 
            throw new HttpError(400, "ID do usuário inválido");
        
        if (!binario)
            throw new HttpError(400, "Nenhuma imagem foi enviada");
        
        try {
            await ValidationUtils.validarTamanhoMaximoImagem(binario);
            log('INFO', 'UserService', 'atualizarFotoPerfilUsuario', 'VALIDAÇÕES FEITAS');

            await UserModel.salvarNovaFoto(id, binario);
            log('INFO', 'UserService', 'atualizarFotoPerfilUsuario', 'FIM bem sucedido');            
        } catch (error) {
            log('ERROR', 'UserService', 'atualizarFotoPerfilUsuario', `ERRO ao atualizar a imagem`);
            console.log(error);
            throw error;
        }
    }

}

export default new UserService();