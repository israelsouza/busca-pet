function getCroppedImg (imageSrc, pixelCrop) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.crossOrigin = 'anonymous'; // importante se a imagem estiver em outro domínio

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Falha ao converter imagem para blob'));
          return;
        }
        resolve(blob);
      }, 'image/jpeg');
    };

    image.onerror = () => {
      reject(new Error('Erro ao carregar imagem'));
    };
  });
};
export default getCroppedImg;