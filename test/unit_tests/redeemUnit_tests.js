const bsv = require('bsv')
const { sighash } = require('../../lib/stas')
const {
    redeem,
    redeemWithCallback,
    unsignedRedeem
} = require('../../index')
const privateKeyStr = 'Ky5XHRQvYEcEbtGoQQQETbctAgAQKvb3PocfJSnkyHuEj5Nzj1pb'
const privateKey = new bsv.PrivateKey(privateKeyStr)
let utxo =      {
    txid: '6c0865711e0a1409f39a712f68f12b0465fb40306634a3a30247a09a1d6f8707',
    vout: 0,
    scriptPubKey: '76a914d2db62a81ebcd89936ea3fe3a566f1516991680588ac6976aa607f5f7f7c5e7f7c5d7f7c5c7f7c5b7f7c5a7f7c597f7c587f7c577f7c567f7c557f7c547f7c537f7c527f7c517f7c7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7c5f7f7c5e7f7c5d7f7c5c7f7c5b7f7c5a7f7c597f7c587f7c577f7c567f7c557f7c547f7c537f7c527f7c517f7c7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e01007e818b21414136d08c5ed2bf3ba048afe6dcaebafeffffffffffffffffffffffffffffff007d976e7c5296a06394677768827601249301307c7e23022079be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798027e7c7e7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e01417e21038ff83d8cf12121491609c4939dc11c4aa35503508fe432dc5a5c1905608b9218ad547f7701207f01207f7701247f517f7801007e8102fd00a063546752687f7801007e817f727e7b01177f777b557a766471567a577a786354807e7e676d68aa880067765158a569765187645294567a5379587a7e7e78637c8c7c53797e577a7e6878637c8c7c53797e577a7e6878637c8c7c53797e577a7e6878637c8c7c53797e577a7e6878637c8c7c53797e577a7e6867567a6876aa587a7d54807e577a597a5a7a786354807e6f7e7eaa727c7e676d6e7eaa7c687b7eaa587a7d877663516752687c72879b69537a647500687c7b547f77517f7853a0916901247f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e816854937f77788c6301247f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e816854937f777852946301247f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e816854937f77686877517f7c52797d8b9f7c53a09b91697c76638c7c587f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e81687f777c6876638c7c587f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e81687f777c6863587f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e81687f7768587f517f7801007e817602fc00a06302fd00a063546752687f7801007e81727e7b7b687f75537f7c0376a9148801147f775379645579887567726881766968789263556753687a76026c057f7701147f8263517f7c766301007e817f7c6775006877686b537992635379528763547a6b547a6b677c6b567a6b537a7c717c71716868547a587f7c81547a557964936755795187637c686b687c547f7701207f75748c7a7669765880748c7a76567a876457790376a9147e7c7e557967041976a9147c7e0288ac687e7e5579636c766976748c7a9d58807e6c0376a9147e748c7a7e6c7e7e676c766b8263828c007c80517e846864745aa0637c748c7a76697d937b7b58807e56790376a9147e748c7a7e55797e7e6868686c567a5187637500678263828c007c80517e846868647459a0637c748c7a76697d937b7b58807e55790376a9147e748c7a7e55797e7e687459a0637c748c7a76697d937b7b58807e55790376a9147e748c7a7e55797e7e68687c537a9d547963557958807e041976a91455797e0288ac7e7e68aa87726d77776a148c4f6edf2246b78e6e1742bee8af5b8de3ed4c000100055441414c54036f6e65',
    satoshis: 7000
}
  
const signatureCallback = async (tx, i, script, satoshis) => {
    return bsv.Transaction.sighash.sign(tx, privateKey, sighash, i, script, satoshis).toTxFormat().toString('hex')
}

describe('Redeem Unit Tests', () => {

    it('should create redeem', async () => {
        const expectedHex = '010000000207876f1d9aa04702a3a334663040fb65042bf1682f719af309140a1e7165086c00000000fd020702581b14fe5697f24aa6e72a1d5f034121156a81d4f46f9502ef1a14fe5697f24aa6e72a1d5f034121156a81d4f46f95002007876f1d9aa04702a3a334663040fb65042bf1682f719af309140a1e7165086c004d420601000000310bf92959131de44d6cf100738a0012e781739a80e3a6baab441a07266947ab752adad0a7b9ceca853768aebb6965eca126a62965f698a0c1bc43d83db632ad07876f1d9aa04702a3a334663040fb65042bf1682f719af309140a1e7165086c00000000fda30576a914d2db62a81ebcd89936ea3fe3a566f1516991680588ac6976aa607f5f7f7c5e7f7c5d7f7c5c7f7c5b7f7c5a7f7c597f7c587f7c577f7c567f7c557f7c547f7c537f7c527f7c517f7c7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7c5f7f7c5e7f7c5d7f7c5c7f7c5b7f7c5a7f7c597f7c587f7c577f7c567f7c557f7c547f7c537f7c527f7c517f7c7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e01007e818b21414136d08c5ed2bf3ba048afe6dcaebafeffffffffffffffffffffffffffffff007d976e7c5296a06394677768827601249301307c7e23022079be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798027e7c7e7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e01417e21038ff83d8cf12121491609c4939dc11c4aa35503508fe432dc5a5c1905608b9218ad547f7701207f01207f7701247f517f7801007e8102fd00a063546752687f7801007e817f727e7b01177f777b557a766471567a577a786354807e7e676d68aa880067765158a569765187645294567a5379587a7e7e78637c8c7c53797e577a7e6878637c8c7c53797e577a7e6878637c8c7c53797e577a7e6878637c8c7c53797e577a7e6878637c8c7c53797e577a7e6867567a6876aa587a7d54807e577a597a5a7a786354807e6f7e7eaa727c7e676d6e7eaa7c687b7eaa587a7d877663516752687c72879b69537a647500687c7b547f77517f7853a0916901247f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e816854937f77788c6301247f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e816854937f777852946301247f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e816854937f77686877517f7c52797d8b9f7c53a09b91697c76638c7c587f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e81687f777c6876638c7c587f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e81687f777c6863587f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e81687f7768587f517f7801007e817602fc00a06302fd00a063546752687f7801007e81727e7b7b687f75537f7c0376a9148801147f775379645579887567726881766968789263556753687a76026c057f7701147f8263517f7c766301007e817f7c6775006877686b537992635379528763547a6b547a6b677c6b567a6b537a7c717c71716868547a587f7c81547a557964936755795187637c686b687c547f7701207f75748c7a7669765880748c7a76567a876457790376a9147e7c7e557967041976a9147c7e0288ac687e7e5579636c766976748c7a9d58807e6c0376a9147e748c7a7e6c7e7e676c766b8263828c007c80517e846864745aa0637c748c7a76697d937b7b58807e56790376a9147e748c7a7e55797e7e6868686c567a5187637500678263828c007c80517e846868647459a0637c748c7a76697d937b7b58807e55790376a9147e748c7a7e55797e7e687459a0637c748c7a76697d937b7b58807e55790376a9147e748c7a7e55797e7e68687c537a9d547963557958807e041976a91455797e0288ac7e7e68aa87726d77776a148c4f6edf2246b78e6e1742bee8af5b8de3ed4c000100055441414c54036f6e65581b000000000000ffffffffc2009fcedb86142f04368550fff570aede0f33f9488aff0f7d4f99d04cee97ec000000004100000047304402204466b540fdad7af968eefa9bf6075e39fc40bcefd49ced8313a10d523a14005502201e0918b4164bbed42a06233802acfe87e729af8252767ea45dd628edee02886641210270d2ae2d5eb30c142347b26b2b4684145b6934d7964127637eaf9ace366945b1ffffffff07876f1d9aa04702a3a334663040fb65042bf1682f719af309140a1e7165086c000000006a47304402204466b540fdad7af968eefa9bf6075e39fc40bcefd49ced8313a10d523a14005502201e0918b4164bbed42a06233802acfe87e729af8252767ea45dd628edee02886641210270d2ae2d5eb30c142347b26b2b4684145b6934d7964127637eaf9ace366945b1ffffffff02581b0000000000001976a914fe5697f24aa6e72a1d5f034121156a81d4f46f9588acef1a0000000000001976a914fe5697f24aa6e72a1d5f034121156a81d4f46f9588ac00000000'
        const hex = await redeem(
            privateKey,
            privateKey.publicKey,
            utxo,
            utxo,
            privateKey
        )
        expect(hex).toBe(expectedHex)
    })
    
    it('should fail with null token owner private key', async () => {
        await expect(() => redeem(
            null,
            privateKey,
            utxo,
            utxo,
            privateKey
        )).rejects.toThrow('Token owner private key is null')
    });
})

describe('Unsigned Unit Tests', () => {

    it('unsignedRedeem returns hex', async () => {
        const expectedHex = '010000000207876f1d9aa04702a3a334663040fb65042bf1682f719af309140a1e7165086c00000000fd980602581b14fe5697f24aa6e72a1d5f034121156a81d4f46f9502ef1a14fe5697f24aa6e72a1d5f034121156a81d4f46f95002007876f1d9aa04702a3a334663040fb65042bf1682f719af309140a1e7165086c004d420601000000310bf92959131de44d6cf100738a0012e781739a80e3a6baab441a07266947ab752adad0a7b9ceca853768aebb6965eca126a62965f698a0c1bc43d83db632ad07876f1d9aa04702a3a334663040fb65042bf1682f719af309140a1e7165086c00000000fda30576a914d2db62a81ebcd89936ea3fe3a566f1516991680588ac6976aa607f5f7f7c5e7f7c5d7f7c5c7f7c5b7f7c5a7f7c597f7c587f7c577f7c567f7c557f7c547f7c537f7c527f7c517f7c7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7c5f7f7c5e7f7c5d7f7c5c7f7c5b7f7c5a7f7c597f7c587f7c577f7c567f7c557f7c547f7c537f7c527f7c517f7c7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e01007e818b21414136d08c5ed2bf3ba048afe6dcaebafeffffffffffffffffffffffffffffff007d976e7c5296a06394677768827601249301307c7e23022079be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798027e7c7e7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e01417e21038ff83d8cf12121491609c4939dc11c4aa35503508fe432dc5a5c1905608b9218ad547f7701207f01207f7701247f517f7801007e8102fd00a063546752687f7801007e817f727e7b01177f777b557a766471567a577a786354807e7e676d68aa880067765158a569765187645294567a5379587a7e7e78637c8c7c53797e577a7e6878637c8c7c53797e577a7e6878637c8c7c53797e577a7e6878637c8c7c53797e577a7e6878637c8c7c53797e577a7e6867567a6876aa587a7d54807e577a597a5a7a786354807e6f7e7eaa727c7e676d6e7eaa7c687b7eaa587a7d877663516752687c72879b69537a647500687c7b547f77517f7853a0916901247f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e816854937f77788c6301247f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e816854937f777852946301247f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e816854937f77686877517f7c52797d8b9f7c53a09b91697c76638c7c587f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e81687f777c6876638c7c587f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e81687f777c6863587f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e81687f7768587f517f7801007e817602fc00a06302fd00a063546752687f7801007e81727e7b7b687f75537f7c0376a9148801147f775379645579887567726881766968789263556753687a76026c057f7701147f8263517f7c766301007e817f7c6775006877686b537992635379528763547a6b547a6b677c6b567a6b537a7c717c71716868547a587f7c81547a557964936755795187637c686b687c547f7701207f75748c7a7669765880748c7a76567a876457790376a9147e7c7e557967041976a9147c7e0288ac687e7e5579636c766976748c7a9d58807e6c0376a9147e748c7a7e6c7e7e676c766b8263828c007c80517e846864745aa0637c748c7a76697d937b7b58807e56790376a9147e748c7a7e55797e7e6868686c567a5187637500678263828c007c80517e846868647459a0637c748c7a76697d937b7b58807e55790376a9147e748c7a7e55797e7e687459a0637c748c7a76697d937b7b58807e55790376a9147e748c7a7e55797e7e68687c537a9d547963557958807e041976a91455797e0288ac7e7e68aa87726d77776a148c4f6edf2246b78e6e1742bee8af5b8de3ed4c000100055441414c54036f6e65581b000000000000ffffffffc2009fcedb86142f04368550fff570aede0f33f9488aff0f7d4f99d04cee97ec0000000041000000ffffffff07876f1d9aa04702a3a334663040fb65042bf1682f719af309140a1e7165086c0000000000ffffffff02581b0000000000001976a914fe5697f24aa6e72a1d5f034121156a81d4f46f9588acef1a0000000000001976a914fe5697f24aa6e72a1d5f034121156a81d4f46f9588ac00000000'
        const res = await unsignedRedeem(
            privateKey.publicKey,
            privateKey.publicKey,
            utxo,
            utxo,
            privateKey.publicKey
        )
        expect(res.hex).toBe(expectedHex)
    }) 
})

describe('RedeemWithCallBack Unit Tests', () => {

       
    it('should create hex redeemWithCallback', async () => {
        const hex = await redeemWithCallback(
            privateKey.publicKey,
            privateKey.publicKey,
            utxo,
            utxo,
            privateKey.publicKey,
            signatureCallback,
            signatureCallback
        )
        expect(hex).toBe('010000000207876f1d9aa04702a3a334663040fb65042bf1682f719af309140a1e7165086c00000000fd020702581b14fe5697f24aa6e72a1d5f034121156a81d4f46f9502ef1a14fe5697f24aa6e72a1d5f034121156a81d4f46f95002007876f1d9aa04702a3a334663040fb65042bf1682f719af309140a1e7165086c004d420601000000310bf92959131de44d6cf100738a0012e781739a80e3a6baab441a07266947ab752adad0a7b9ceca853768aebb6965eca126a62965f698a0c1bc43d83db632ad07876f1d9aa04702a3a334663040fb65042bf1682f719af309140a1e7165086c00000000fda30576a914d2db62a81ebcd89936ea3fe3a566f1516991680588ac6976aa607f5f7f7c5e7f7c5d7f7c5c7f7c5b7f7c5a7f7c597f7c587f7c577f7c567f7c557f7c547f7c537f7c527f7c517f7c7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7c5f7f7c5e7f7c5d7f7c5c7f7c5b7f7c5a7f7c597f7c587f7c577f7c567f7c557f7c547f7c537f7c527f7c517f7c7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e01007e818b21414136d08c5ed2bf3ba048afe6dcaebafeffffffffffffffffffffffffffffff007d976e7c5296a06394677768827601249301307c7e23022079be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798027e7c7e7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c8276638c687f7c7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e01417e21038ff83d8cf12121491609c4939dc11c4aa35503508fe432dc5a5c1905608b9218ad547f7701207f01207f7701247f517f7801007e8102fd00a063546752687f7801007e817f727e7b01177f777b557a766471567a577a786354807e7e676d68aa880067765158a569765187645294567a5379587a7e7e78637c8c7c53797e577a7e6878637c8c7c53797e577a7e6878637c8c7c53797e577a7e6878637c8c7c53797e577a7e6878637c8c7c53797e577a7e6867567a6876aa587a7d54807e577a597a5a7a786354807e6f7e7eaa727c7e676d6e7eaa7c687b7eaa587a7d877663516752687c72879b69537a647500687c7b547f77517f7853a0916901247f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e816854937f77788c6301247f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e816854937f777852946301247f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e816854937f77686877517f7c52797d8b9f7c53a09b91697c76638c7c587f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e81687f777c6876638c7c587f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e81687f777c6863587f77517f7c01007e817602fc00a06302fd00a063546752687f7c01007e81687f7768587f517f7801007e817602fc00a06302fd00a063546752687f7801007e81727e7b7b687f75537f7c0376a9148801147f775379645579887567726881766968789263556753687a76026c057f7701147f8263517f7c766301007e817f7c6775006877686b537992635379528763547a6b547a6b677c6b567a6b537a7c717c71716868547a587f7c81547a557964936755795187637c686b687c547f7701207f75748c7a7669765880748c7a76567a876457790376a9147e7c7e557967041976a9147c7e0288ac687e7e5579636c766976748c7a9d58807e6c0376a9147e748c7a7e6c7e7e676c766b8263828c007c80517e846864745aa0637c748c7a76697d937b7b58807e56790376a9147e748c7a7e55797e7e6868686c567a5187637500678263828c007c80517e846868647459a0637c748c7a76697d937b7b58807e55790376a9147e748c7a7e55797e7e687459a0637c748c7a76697d937b7b58807e55790376a9147e748c7a7e55797e7e68687c537a9d547963557958807e041976a91455797e0288ac7e7e68aa87726d77776a148c4f6edf2246b78e6e1742bee8af5b8de3ed4c000100055441414c54036f6e65581b000000000000ffffffffc2009fcedb86142f04368550fff570aede0f33f9488aff0f7d4f99d04cee97ec000000004100000047304402204466b540fdad7af968eefa9bf6075e39fc40bcefd49ced8313a10d523a14005502201e0918b4164bbed42a06233802acfe87e729af8252767ea45dd628edee02886641210270d2ae2d5eb30c142347b26b2b4684145b6934d7964127637eaf9ace366945b1ffffffff07876f1d9aa04702a3a334663040fb65042bf1682f719af309140a1e7165086c000000006a47304402204466b540fdad7af968eefa9bf6075e39fc40bcefd49ced8313a10d523a14005502201e0918b4164bbed42a06233802acfe87e729af8252767ea45dd628edee02886641210270d2ae2d5eb30c142347b26b2b4684145b6934d7964127637eaf9ace366945b1ffffffff02581b0000000000001976a914fe5697f24aa6e72a1d5f034121156a81d4f46f9588acef1a0000000000001976a914fe5697f24aa6e72a1d5f034121156a81d4f46f9588ac00000000')
    })

    it('should fail with null token owner public key', async () => {
        await expect(() => redeemWithCallback(
            null,
            privateKey.publicKey,
            utxo,
            utxo,
            privateKey.publicKey,
            signatureCallback,
            signatureCallback
          )).rejects.toThrow('Token owner public key is null')
    });

    it('should fail with null issuer public key', async () => {
        await expect(() => redeemWithCallback(
            privateKey.publicKey,
            null,
            utxo,
            utxo,
            privateKey.publicKey,
            signatureCallback,
            signatureCallback
          )).rejects.toThrow('contract public key is null')
    });

    it('should fail with null stas utxo', async () => {
        await expect(() => redeemWithCallback(
            privateKey.publicKey,
            privateKey.publicKey,
            null,
            utxo,
            privateKey.publicKey,
            signatureCallback,
            signatureCallback
          )).rejects.toThrow('stasUtxo is null')
    });

    it('should fail with null funding utxo', async () => {
        await expect(() => redeemWithCallback(
            privateKey.publicKey,
            privateKey.publicKey,
            utxo,
            null,
            privateKey.publicKey,
            signatureCallback,
            signatureCallback
          )).rejects.toThrow('Payment key provided but payment UTXO is null')
    });

    it('should fail with null funding public key', async () => {
        await expect(() => redeemWithCallback(
            privateKey.publicKey,
            privateKey.publicKey,
            utxo,
            utxo,
            null,
            signatureCallback,
            signatureCallback
          )).rejects.toThrow('Payment UTXO provided but payment key is null')
    });
})