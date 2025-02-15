<template>
  <form>
    <FloatLabel class="group-name" variant="in">
      <InputText id="group_name" class="group-name" v-model="groupName" />
      <label for="group_name">Gruppenname</label>
    </FloatLabel>
    <Panel class="transaction-fields" header="Transaktionen">
      <Panel
        class="transaction-fields"
        v-for="transformedTransaction in transformedTransactions"
        :header="transformedTransaction.sender"
        :key="transformedTransaction.sender"
      >
        <div
          class="transaction-field"
          v-for="transaction in transformedTransaction.transactions"
          :key="transaction.purpose"
        >
          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-user"></i>
            </InputGroupAddon>
            <InputText v-model="transaction.purpose" placeholder="Sender" />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-user"></i>
            </InputGroupAddon>
            <MultiSelect
              placeholder="Gezahlt für..."
              v-model="transaction.receiver"
              :options="getSenders()"
            ></MultiSelect>
          </InputGroup>
          <InputGroup>
            <InputGroupAddon>$</InputGroupAddon>
            <InputNumber v-model="transaction.amount" placeholder="Price" />
          </InputGroup>
        </div>
      </Panel>
    </Panel>
  </form>
</template>

<script lang="ts">
import { type BlockchainMap, useBlockchainStore } from '@/stores/blockchain.ts'
import { Blockchain, generateKeypair, hashPrivateKey } from '@/logic/Blockchain.ts'
import {
  toTransformedTransactions,
  Transaction,
  type TransformedTransaction,
} from '@/logic/Transaction.ts'

export default {
  name: 'GroupView',
  data() {
    return {
      store: useBlockchainStore(),
      groupName: undefined as string | undefined,
      blockchain: undefined as Blockchain | undefined,
      privateKey: undefined as CryptoKey | undefined,
      privateKeyHash: undefined as string | undefined,
      publicKey: undefined as CryptoKey | undefined,
      transformedTransactions: [] as TransformedTransaction[],
    }
  },

  async mounted() {
    if (this.$route.params.id) {
      const possibleBlockchain: BlockchainMap | undefined = this.store.getBlockchain(
        <string>this.$route.params.id,
      )

      // Data was found for this on the blockchain
      if (possibleBlockchain) {
        this.groupName = possibleBlockchain.name
        this.blockchain = possibleBlockchain.blockchain
        this.privateKeyHash = possibleBlockchain.privateKeyHash
        this.privateKey = await window.crypto.subtle.importKey(
          'jwk',
          possibleBlockchain.privateKey,
          { name: 'RSASSA-PKCS1-v1_5' },
          true,
          ['sign', 'verify'],
        )
        this.publicKey = await window.crypto.subtle.importKey(
          'jwk',
          possibleBlockchain.publicKey,
          { name: 'RSASSA-PKCS1-v1_5' },
          true,
          ['sign', 'verify'],
        )

        this.transformedTransactions = toTransformedTransactions(
          possibleBlockchain.blockchain.getAllTransactions(),
        )
      }
    } else {
      const keyPair = await generateKeypair()
      this.privateKey = keyPair.privateKey
      this.publicKey = keyPair.publicKey
      this.blockchain = new Blockchain()
      this.privateKeyHash = await hashPrivateKey(keyPair.privateKey)
      await this.blockchain.addBlock(keyPair, [], [])

      // Remove this
      this.transformedTransactions = toTransformedTransactions([
        new Transaction(1, 'Bier', 'Tobias', 'Michi', 4),
        new Transaction(2, 'Bier', 'Tobias', 'Thieny', 4),
        new Transaction(3, 'Käse', 'Tobias', 'Michi', 6),
        new Transaction(4, 'Bier', 'Tobias', 'Fabi', 4),
        new Transaction(5, 'Bier', 'Tobias', 'Jessy', 4),
        new Transaction(6, 'Bier', 'Tobias', 'Krissi', 4),
        new Transaction(7, 'Essen', 'Michi', 'Tobias', 15),
      ])
    }
  },

  methods: {
    getSenders(): string[] {
      return this.transformedTransactions.map((transaction) => transaction.sender)
    },

    hasEmptyTransaction(transformedTransaction: TransformedTransaction): boolean {
      return (
        transformedTransaction.transactions.filter(
          ({ receiver, purpose, amount }) =>
            receiver.length === 0 && purpose === '' && amount === 0,
        ).length !== 0
      )
    },

    addEmptyPayment(): void {
      // Add a new transaction to a sender if all are specified
      this.transformedTransactions.forEach(
        (transformedTransaction: TransformedTransaction): void => {
          if (!this.hasEmptyTransaction(transformedTransaction)) {
            transformedTransaction.transactions.push({receiver: [], purpose: '', amount: 0})
          }
        },
      )
    },
  },

  watch: {
    transformedTransactions: {
      handler() {
        this.addEmptyPayment()
      },
      deep: true,
    },
  },
}
</script>

<style scoped>
form {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;
}

.group-name {
  grid-column: 1 / span 3;
  width: 100%;
}

.group-name > input {
  width: 100%;
}

.transaction-fields {
  grid-column: 1 / span 3;
  width: 100%;
  gap: 1rem;
}

.transaction-field {
  display: flex;
  gap: 0.5rem;
}

.transaction-field input {
  max-width: 100%;
}
</style>
