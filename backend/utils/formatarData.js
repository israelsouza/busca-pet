export default function formatarDataParaDDMMYYYY(data) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}-${mes}-${ano}`;
}