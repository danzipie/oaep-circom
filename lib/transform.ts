export const buffer2bitArray = (b: Buffer) => {
  // from circomlib tests folder
  const res: number[] = [];
  for (let i = 0; i < b.length; i++) {
    for (let j = 0; j < 8; j++) {
      res.push((b[i] >> (7 - j)) & 1);
    }
  }
  return res;
};

export const bitArrayToHex = (arr: number[] | bigint[]) => {
  const result = parseInt(arr.join(""), 2).toString(16).padStart(arr.length / 4, '0');
  return result
};

export const bitArray2buffer = (a: number[]) => {
  const len = Math.floor((a.length - 1) / 8) + 1;
  const b = new Buffer(len);

  for (let i = 0; i < a.length; i++) {
      const p = Math.floor(i / 8);
      b[p] = b[p] | (Number(a[i]) << (7 - (i % 8)));
  }
  return b;
}


export const getHexHashFromCircuitOut = (arrOut: any) => {

  const l = Math.ceil(arrOut.length / 32);
  var r = '';
  for (var i= 0; i < l; i++) {
    var word = arrOut.slice(32*i, 32*(i+1));
    r = r + bitArrayToHex(word);
  }

  return r;
}
