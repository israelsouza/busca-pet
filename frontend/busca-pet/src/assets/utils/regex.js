/**
 *    Funções que utilizam o padrão regex para validação dos inputs.
 * 
 */

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