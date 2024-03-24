pragma circom 2.1.3;

include "../node_modules/circomlib/circuits/bitify.circom";
include "./sha1-circom/sha1.circom";

// receives an input seed of length seedLength
// outputs the MFG1 of length length
template MGF1(seedLength, length) {
    signal input in[seedLength];

    signal output T[length];

    var hLen = 160; // hash_func().digest_size

    assert(length <= (hLen << 32));
    var iters = ((length - 1) \ hLen) + 1;
    var v[hLen * iters];
    var vReversed[hLen * iters];
    var j = 0;

    component C[iters];
    component sha[iters];

    for (var iter = 0; iter < iters; iter++) {

        // Convert counter to an octet string C of length 4
        // with the primitive I2OSP: C = I2OSP (counter, 4)
        C[iter] = Num2Bits(32);
        C[iter].in <== iter;

        sha[iter] = Sha1(seedLength + 32);

        // Calculate the hash of the seed Z and C: Hash (Z || C)
        var i_s = 0;
        for (var i = 0; i < seedLength; i++) {
            sha[iter].in[i_s] <== in[i];
            i_s++;
        }
        for (var i = 0; i < 32; i++) {
            sha[iter].in[i_s] <== C[iter].out[32 - i - 1];
            i_s++;
        }

        // Concatenate the hash to the octet string T: T = T || Hash (Z || C)
        for (var i = 0; i < hLen; i++) {
            v[j] = sha[iter].out[i];
            j += 1;
        }
    }

    // reverse endianness
    for (var i = 0; (i < hLen * iters / 32 ); i++) {
      for (var j = 0; j < 32; j++) {
        vReversed[32*i + j] = v[32*i + (31-j)];
      }
    }

    // Output the leading l octets of T as the octet string mask
    for (var i = 0; i < length; i++) {
        T[i] <== vReversed[i];
    }
}
