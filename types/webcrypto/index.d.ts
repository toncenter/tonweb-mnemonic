
declare module 'crypto' {

  type IntTypedArray = (
    | Int8Array
    | Uint8Array
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
  );

  namespace webcrypto {

    const subtle: SubtleCrypto;

    function getRandomValues(
      typedArray: IntTypedArray

    ): IntTypedArray;

  }

}
