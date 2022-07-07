const { generateKeys } = require('./util/rsa-util.js')
const fs = require('fs').promises
const fsSync = require('fs')
const { pubKeyPath, priKeyPath } = require('../config')

module.exports = {
  // getPrivateKeySync () {
  //   try {
  //     let key = fsSync.readFileSync(priKeyPath, 'utf-8')
  //     if(!key){
  //       generateKeys()
  //       key = fsSync.readFileSync(priKeyPath, 'utf-8')
  //     }
  //     return key
  //   } catch(err){
  //     console.log(err);
  //   }
  // },
  getPublicKeySync () {
    try {
      let key = fsSync.readFileSync(pubKeyPath, 'utf-8')
      if(!key){
        generateKeys()
        key = fsSync.readFileSync(pubKeyPath, 'utf-8')
      }
      return key
    } catch(err){
      console.log(err);
    }
  },
  async getPublicKey () {
    try {
      let key = await fs.readFile(pubKeyPath, 'utf8')
      if(!key){
        generateKeys()
        key = await fs.readFile(pubKeyPath, 'utf8')
      }
      return key
    } catch (err) {
      console.log('err');
    }
  },
  async getPrivateKey () {
    try {
      let key = await fs.readFile(priKeyPath, 'utf8')
      if(!key){
        generateKeys()
        key = await fs.readFile(priKeyPath, 'utf8')
      }
      return key
    } catch (err) {
      console.log(err);
    }
  }
}
