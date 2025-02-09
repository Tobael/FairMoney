<template>
  <form>
    <input type="text" v-model="groupName" />
  </form>
</template>

<script lang="ts">
import { type BlockchainMap, useBlockchainStore } from '@/stores/blockchain.ts'
import { Blockchain, generateKeypair, hashPrivateKey } from '@/logic/Blockchain.ts'

export default {
  name: 'GroupView',
  data() {
    return {
      store: useBlockchainStore(),
      groupName: undefined as string | undefined,
      blockchain: undefined as Blockchain | undefined,
      privateKey: undefined as CryptoKey | undefined,
      privateKeyHash: undefined as string | undefined,
    }
  },

  async mounted() {
    if (this.$route.params.id) {
      const possibleBlockchain: BlockchainMap | undefined = this.store.getBlockchain(
        <string>this.$route.params.id,
      )
      if (possibleBlockchain) {
        this.groupName = possibleBlockchain.name
        this.blockchain = possibleBlockchain.blockchain
        this.privateKeyHash = possibleBlockchain.privateKeyHash
        // Needs to be replaced by a private key
        this.privateKey = await window.crypto.subtle.importKey('jwk', possibleBlockchain.privateKey, { name: 'RSASSA-PKCS1-v1_5' }, true, ["sign", "verify"])
      }
    } else {
      const keyPair = await generateKeypair()
      this.privateKey = keyPair.privateKey
      this.blockchain = new Blockchain()
      this.privateKeyHash = await hashPrivateKey(keyPair.privateKey)
      await this.blockchain.addBlock(keyPair, [], [])
    }
  },
}
</script>

<style scoped></style>
