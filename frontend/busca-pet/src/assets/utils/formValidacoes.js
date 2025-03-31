export function verificarCampoVazio(lista) {
  let hasError = false;
  lista.forEach((currentElement) => {
    if (!currentElement.ref.value.trim()) {
      currentElement.setErro(currentElement.mensagem);
      currentElement.ref.focus();
      hasError = true;
    } else {
      currentElement.setErro("");
    }
  });
  return hasError;
}

export function verificarTamanhoMaximo(array) {
  let hasError = false;
  array.forEach((itemList) => {
    if (itemList.ref.value.length > itemList.limite) {
      itemList.setErro(itemList.mensagem);
      itemList.ref.focus();
      hasError = true;
    } else {
      itemList.setErro("");
    }
  });
  return hasError;
}

export function verificarTamanhoFixo(array) {
  let hasError = false;
  array.forEach((itemList) => {
    if (itemList.ref.value.length != itemList.quantidade) {
      itemList.setErro(itemList.mensagem);
      itemList.ref.focus();
      hasError = true;
    } else {
      itemList.setErro("");
    }
  });
  return hasError;
}

export function verificarTamanhoMinimo(
  input,
  qtddCaracteres,
  setErro,
  mensagemErro
) {
  let hasError = false;
  if (input.value.length < qtddCaracteres) {
    setErro(mensagemErro);
    input.focus();
    hasError = true;
  } else {
    setErro("");
  }
  return hasError;
}

export function verificarSeTemLetras(array) {
  let hasError = false;

  array.forEach((itemList) => {
    if (!/\d/.test(itemList.ref.value)) {
      itemList.setErro(itemList.mensagem);
      itemList.ref.focus();
      hasError = true;
    } else {
      itemList.setErro("");
    }
  });

  return hasError;
}

export function verificarSeTemNumeros(array) {
  let hasError = false;
  array.forEach((itemList) => {
    if (/\d/.test(itemList.ref.value)) {
      itemList.setErro(itemList.mensagem);
      itemList.ref.focus();
      hasError = true;
    } else {
      itemList.setErro("");
    }
  });
  return hasError;
}
