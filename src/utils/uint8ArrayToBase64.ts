export const uint8ArrayToBase64 = (uint8Array: any) => {
  return btoa(
    new Uint8Array(uint8Array).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );
};
