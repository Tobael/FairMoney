import { defineStore } from 'pinia'
import { Blockchain } from '@/logic/Blockchain.ts'

export type BlockchainMap = {
  name: string
  privateKey: object
  privateKeyHash: string
  publicKey: object
  blockchain: Blockchain
}

export const useBlockchainStore = defineStore('blockchain', {
  state: () => {
    return {
      blockchains: [] as BlockchainMap[],
    }
  },

  actions: {
    upsertBlockchain(
      name: string,
      privateKey: object,
      privateKeyHash: string,
      publicKey: object,
      blockchain: Blockchain,
    ) {
      let isNewBlockchain = true
      for (let i = 0; i < this.blockchains.length; i++) {
        if (this.blockchains[i].privateKeyHash === privateKeyHash) {
          this.blockchains[i].blockchain = blockchain
          isNewBlockchain = false
          break
        }
      }
      if (isNewBlockchain) {
        this.blockchains.push({ name, privateKey, privateKeyHash, publicKey, blockchain })
      }

      this.persistToLocalStorage()
    },

    persistToLocalStorage() {
      localStorage.setItem('blockchain', JSON.stringify(this.blockchains))
    },

    importBlockchains() {
      const string: string | null = localStorage.getItem('blockchains')
      if (string) {
        const storeObjects = JSON.parse(string)
        this.blockchains = storeObjects.map(
          ({ name, privateKey, privateKeyHash, publicKey, blockchain }: BlockchainMap) => {
            return {
              name,
              privateKey,
              privateKeyHash,
              publicKey,
              blockchain: Blockchain.from(blockchain),
            }
          },
        )
      }
    },

    getBlockchain(privateKeyHash: string): BlockchainMap | undefined {
      return this.blockchains.find((blockchain) => blockchain.privateKeyHash === privateKeyHash)
    },
  },
})
