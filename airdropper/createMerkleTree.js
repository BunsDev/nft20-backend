const { keccak256, keccakFromString, keccakFromHexString, bufferToHex, BN } = require('ethereumjs-util');
const { MerkleTree } = require('./libMerkle.js')
const jsonfile = require('jsonfile')

const NUMBER_OF_DROPS = 10;
const FILE_TO_SAVE = "keys.json";

(async function () {

    function decimalToHex(d, padding) {
        var hex = Number(d).toString(16);
        padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

        while (hex.length < padding) {
            hex = "0" + hex;
        }

        return hex;
    }

    let initial_leaves = []

    let test_proof = ""

    // We generate NUMBER OF DROPS of keys
    // To claim a NFT you'll need the index and a secret key that matches the index
    for (let index = 0; index < NUMBER_OF_DROPS; index++) {
        //console.log(initial_leaves)
        initial_leaves.push('0x' + decimalToHex(index, 64))
    }

    const merkleTree = new MerkleTree(initial_leaves);

    const root = merkleTree.getHexRoot();
    console.log('MERKLE TREE ROOT: ', root)
    let result = {
        currentIndex: 0,
        keys: [],
        claimed: {}
    }
    for (let index = 0; index < NUMBER_OF_DROPS; index++) {
        //console.log(initial_leaves)
        const proof = merkleTree.getHexProof(initial_leaves[index]);
        const leaf = bufferToHex(keccakFromHexString(initial_leaves[index]));
        result.keys.push( {
            index: index,
            leaf: leaf,
            proof: proof.join('')
        } )
    }

    jsonfile.writeFileSync(FILE_TO_SAVE, result)

})();
