const expect = require('chai').expect
const utils = require('../utils/test_utils')
const bsv = require('bsv')
require('dotenv').config()

const {
  contract,
  issue,
  transfer,
  split,
  redeem
} = require('../../index')

const {
  getTransaction,
  getFundsFromFaucet,
  broadcast
} = require('../../index').utils

describe('regression, testnet', () => {
  it('Full Life Cycle Test NFT 3', async () => {
    const issuerPrivateKey = bsv.PrivateKey()
    const fundingPrivateKey = bsv.PrivateKey()
    const alicePrivateKey = bsv.PrivateKey()
    const aliceAddr = alicePrivateKey.toAddress(process.env.NETWORK).toString()
    const bobPrivateKey = bsv.PrivateKey()
    const bobAddr = bobPrivateKey.toAddress(process.env.NETWORK).toString()
    const davePrivate = bsv.PrivateKey()
    const daveAddr = davePrivate.toAddress(process.env.NETWORK).toString()
    const contractUtxos = await getFundsFromFaucet(issuerPrivateKey.toAddress(process.env.NETWORK).toString())
    const fundingUtxos = await getFundsFromFaucet(fundingPrivateKey.toAddress(process.env.NETWORK).toString())
    const publicKeyHash = bsv.crypto.Hash.sha256ripemd160(issuerPrivateKey.publicKey.toBuffer()).toString('hex')
    const supply = 14000
    const satsPerSupply = 1000
    const symbol = 'TAALT'

    const schema = utils.schema(publicKeyHash, symbol, supply)
    schema.satsPerSupply = satsPerSupply

    const contractHex = contract(
      issuerPrivateKey,
      contractUtxos,
      fundingUtxos,
      fundingPrivateKey,
      schema,
      supply
    )
    const contractTxid = await broadcast(contractHex)
    console.log(`Contract TX:     ${contractTxid}`)
    const contractTx = await getTransaction(contractTxid)
    const amount = await utils.getVoutAmount(contractTxid, 0)
    expect(amount).to.equal(supply / 100000000)

    const issueInfo = [
      {
        addr: aliceAddr,
        satoshis: 8000,
        data: 'one'
      },
      {
        addr: bobAddr,
        satoshis: 4000,
        data: 'two'
      },
      {
        addr: daveAddr,
        satoshis: 2000,
        data: 'three'
      }
    ]

    let issueHex
    try {
      issueHex = issue(
        issuerPrivateKey,
        issueInfo,
        utils.getUtxo(contractTxid, contractTx, 0),
        utils.getUtxo(contractTxid, contractTx, 1),
        fundingPrivateKey,
        false,
        symbol,
        2
      )
    } catch (e) {
      console.log('error issuing token', e)
      return
    }
    const issueTxid = await broadcast(issueHex)
    console.log(`Issue TX:        ${issueTxid}`)
    const issueTx = await getTransaction(issueTxid)
    const tokenId = await utils.getToken(issueTxid)
    const response = await utils.getTokenResponse(tokenId)
    expect(response.symbol).to.equal(symbol)
    expect(response.contract_txs).to.contain(contractTxid)
    expect(response.issuance_txs).to.contain(issueTxid)
    expect(await utils.getVoutAmount(issueTxid, 0)).to.equal(0.00008)
    expect(await utils.getVoutAmount(issueTxid, 1)).to.equal(0.00004)
    expect(await utils.getVoutAmount(issueTxid, 2)).to.equal(0.00002)
    console.log('Alice Balance ' + (await utils.getTokenBalance(aliceAddr)))
    console.log('Bob Balance ' + (await utils.getTokenBalance(bobAddr)))
    console.log('Dave Balance ' + (await utils.getTokenBalance(daveAddr)))
    expect(await utils.getTokenBalance(aliceAddr)).to.equal(8000)
    expect(await utils.getTokenBalance(bobAddr)).to.equal(4000)
    expect(await utils.getTokenBalance(daveAddr)).to.equal(2000)

    const issueOutFundingVout = issueTx.vout.length - 1

    const transferHex = transfer(
      alicePrivateKey,
      utils.getUtxo(issueTxid, issueTx, 0),
      bobAddr,
      utils.getUtxo(issueTxid, issueTx, issueOutFundingVout),
      fundingPrivateKey
    )
    const transferTxid = await broadcast(transferHex)
    console.log(`Transfer TX:     ${transferTxid}`)
    const transferTx = await getTransaction(transferTxid)
    expect(await utils.getVoutAmount(transferTxid, 0)).to.equal(0.00008)
    expect(await utils.getTokenBalance(aliceAddr)).to.equal(0)
    expect(await utils.getTokenBalance(bobAddr)).to.equal(12000)
    expect(await utils.getTokenBalance(daveAddr)).to.equal(2000)

    // Attempt to split - throws error
    const bobAmount1 = transferTx.vout[0].value / 2
    const bobAmount2 = transferTx.vout[0].value - bobAmount1
    const splitDestinations = []
    splitDestinations[0] = { address: bobAddr, amount: bobAmount1 }
    splitDestinations[1] = { address: bobAddr, amount: bobAmount2 }

    const splitHex = split(
      alicePrivateKey,
      utils.getUtxo(transferTxid, transferTx, 0),
      splitDestinations,
      utils.getUtxo(transferTxid, transferTx, 1),
      fundingPrivateKey
    )
    try {
      await broadcast(splitHex)
      assert(false)
    } catch (e) {
      expect(e).to.be.instanceOf(Error)
      expect(e.message).to.eql('Request failed with status code 400')
    }

    const redeemHex = redeem(
      bobPrivateKey,
      issuerPrivateKey.publicKey,
      utils.getUtxo(transferTxid, transferTx, 0),
      utils.getUtxo(transferTxid, transferTx, 1),
      fundingPrivateKey
    )
    const redeemTxid = await broadcast(redeemHex)
    console.log(`Redeem TX:       ${redeemTxid}`)
    expect(await utils.getVoutAmount(redeemTxid, 0)).to.equal(0.00008)
    expect(await utils.getTokenBalance(bobAddr)).to.equal(4000)
    expect(await utils.getTokenBalance(aliceAddr)).to.equal(0)
    expect(await utils.getTokenBalance(daveAddr)).to.equal(2000)
  })
})
