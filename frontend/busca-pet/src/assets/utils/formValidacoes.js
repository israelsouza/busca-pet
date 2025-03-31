export function verificarCampoVazio(lista, hasError) {
  lista.forEach((currentElement) => {
    if (!currentElement.ref.value.trim()) {
      currentElement.setErro(currentElement.mensagem);
      currentElement.ref.focus();
      hasError = true || hasError;
    } else {
      currentElement.setErro("");
      hasError = false || hasError;
    }
  });
}

export function verificarTamanhoMaximo(array, hasError) {
  array.forEach((itemList) => {
    if (itemList.ref.value.length > itemList.limite) {
      itemList.setErro(itemList.mensagem);
      itemList.ref.focus();
      hasError = true || hasError;
    } else {
      itemList.setErro("");
      hasError = false || hasError;
    }
  });
}

export function verificarTamanhoFixo(array, hasError) {
  array.forEach((itemList) => {
    if (itemList.ref.value.length != itemList.quantidade) {
      itemList.setErro(itemList.mensagem);
      itemList.ref.focus();
      hasError = true || hasError;
    } else {
      itemList.setErro("");
      hasError = false || hasError;
    }
  });
}

export function verificarTamanhoMinimo(  input,  qtddCaracteres,  setErro,  mensagemErro) {
  if (input.value.length < qtddCaracteres) {
    setErro(mensagemErro);
    input.focus();
    return true;
  } else {
    setErro("");
    return false;
  }
}
