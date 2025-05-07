/**
 *    Funções que utilizam o padrão regex para validação dos inputs.
 * 
 */

export function validarCampoVazio(config) {
    let hasError = false;

    if (config.campo) {
        if (!config.campo.value.trim()) { 
            config.setErro(config.mensagem);
            config.campo.focus();
            hasError = true;
        } else {
            config.setErro(""); 
        }
    } else if (config.campos && Array.isArray(config.campos)) {
        config.campos.forEach(element => {
        if (!element.ref.value.trim()) {
            element.setErro(element.mensagem);
            element.ref.focus();
            hasError = true;
        } else {
            element.setErro("");
        }
        });
    }

    return hasError;
}

export function validarTamanhoMinimo(config){
    let hasError = false;

    if(config.campo){
        if(config.campo.value.length < config.min){
            config.setErro(config.mensagem)
            config.campo.focus();
            hasError = true;
        } else {
            config.setErro("");
        }
    } else if ( config.campos && Array.isArray(config.campos)  ) {
        config.campos.forEach(element => {
            if ( element.ref.value.length < element.min ) {
                element.setErro(element.mensagem);
                element.ref.focus();
                hasError = true;
            } else {
                element.setErro("")
            }
        });
    }

    return hasError;
}

export function validarCampoEmail(config) {
    let hasError = false;
    const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(config.campo) {
        if(!emailRegex.test(config.campo.value)) {
            config.setErro(config.mensagem);
            config.campo.focus();
            hasError = true;
        } else {
            config.setErro("");
        }
    } else if ( config.campos && Array.isArray(config.campos) ) {
        config.campos.forEach( element => {
            if ( !emailRegex.test(element.ref.value)  ) {
                element.setErro(element.mensagem);
                element.ref.focus();
                hasError = true;
            } else {
                element.setErro("")
            }
        })
    }

    return hasError;
}

export function validarDataLimite(config) {
    let hasError = false;
  
    if (config.campo && config.campo.value) {
      const selectedDate = new Date(config.campo.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      if (config.dataMinima) {
        const dataMin = new Date(config.dataMinima);
        dataMin.setHours(0, 0, 0, 0);
        if (selectedDate < dataMin) {
          config.setErro(config.mensagemErroMinima || `Por favor, selecione uma data a partir de ${config.dataMinima}.`);
          hasError = true;
        }
      }
  
      if (selectedDate > today) {
        config.setErro(config.mensagemErroLimite || "Por favor, selecione uma data anterior ou igual a hoje.");
        hasError = true;
      } else if (!hasError) {
        config.setErro(""); // Limpa o erro se passar ambas as validações
      }
    } else if (config.campo) {
      config.setErro(config.mensagemObrigatoria || "Por favor, selecione uma data.");
      hasError = true;
    }
  
    return hasError;
  }