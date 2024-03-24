//@ts-ignore
import { wasm } from "circom_tester";
import path from "path";
import * as forge from "node-forge";
import { expect } from "chai";
//@ts-ignore
import {
  buffer2bitArray,
  getHexHashFromCircuitOut,
} from "../lib/transform";

describe("Test MGF1", () => {

  describe("Computing MGF1 with SHA-1", () => {
    it("Should output correct hash value of a 24bits input", async () => {
      const cir = await wasm(
        path.join(__dirname, "../../test/circuits/main24.circom"),
        {
          include: path.join(__dirname, "../../node_modules"),
        }
      );

      const testStr = "bar";
      const b = Buffer.from(testStr, "utf-8");
      const arrIn = buffer2bitArray(b);
      const witness = await cir.calculateWitness({ in: arrIn }, true);
      await cir.checkConstraints(witness);

      const arrOut = witness.slice(1, 400+1);
      const circuitHashOut = getHexHashFromCircuitOut(arrOut);

      const m = forge.mgf.mgf1.create(forge.md.sha1.create())
      const forged = forge.util.bytesToHex(m.generate(testStr, 50));

      expect(forged).to.equal(circuitHashOut);
    });
  });
});
