import log from './logger.js'
import HttpError from './HttpError.js';

class ValidationUtils {
    validarCampoObrigatorio(valor, campo){
        log('INFO', 'ValidationUtils', 'validarCampoObrigatorio', 'INICIO')
        if( !valor ) throw new HttpError(400, `O campo ${campo} é obrigatório`)
            if (campo !== "senha") valor = valor.trim();
        log('INFO', 'ValidationUtils', 'validarCampoObrigatorio', 'FIM')
        return valor;
    }
    
    formatarDataParaDDMMYYYY(data) {
        log('INFO', 'ValidationUtils', 'formatarDataParaDDMMYYYY', 'INICIO')
        const [ano, mes, dia] = data.split("-");
        log('INFO', 'ValidationUtils', 'formatarDataParaDDMMYYYY', 'FIM')
        return `${dia}-${mes}-${ano}`;
    }

    validarTamanho(valor, campo){
        log('INFO', 'ValidationUtils', 'validarTamanho', 'INICIO')
        switch (campo) {            
            case "nome-pet":
                if (valor.length > 70) throw new HttpError(400, "A quantidade de caracteres do campo nome do pet excedeu o limite.");
                break;

            case "tipo-pet":
                if (valor.length > 25) throw new HttpError(400, "A quantidade de caracteres do campo tipo do pet excedeu o limite.");
                break;

            case "descrição":
                if (valor.length > 150) throw new HttpError(400, "A quantidade de caracteres do campo descrição excedeu o limite.");
                break;

            case "data":
                if (valor.length > 10) throw new HttpError(400, "A quantidade de caracteres do campo data excedeu o limite.");
                break;
        
            default:
                throw new Error("Campo inconclusivo, tente novamente");
                break;                
        }

        log('INFO', 'ValidationUtils', 'validarTamanho', 'FIM')
        return true;
    }


}

export default new ValidationUtils();