import log from '../utils/logger.js'
import bcrypt from 'bcrypt'
import UserModel from '../model/UserModel.js'

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

}

export default new UserService();