export function verificarCampoVazio(lista, hasError) {
  lista.forEach((currentElement, index) => {
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
