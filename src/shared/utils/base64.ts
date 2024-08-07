export const base64 = () => {
  const toImageURL = (base64: string): string => {
    const blob = base64toBlob(base64);

    return URL.createObjectURL(blob);
  };

  const base64toBlob = (
    b64Data: string,
    contentType = "",
    sliceSize = 512
  ): Blob => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  };

  return {
    toImageURL,
  };
};
