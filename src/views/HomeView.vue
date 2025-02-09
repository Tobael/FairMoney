<template>
  <div>
  <RouterLink to="/group">Gruppe erstellen</RouterLink>
  </div>
</template>

<script lang="ts">
  import { useBlockchainStore } from '@/stores/blockchain.ts'

  export default {

    data() {
      return {
        store: useBlockchainStore()
      }
    },

    async mounted() {
      if (this.store.blockchains.length === 0 && localStorage.getItem("blockchains")) {
        this.store.importBlockchains()
      }
    },
  }
</script>

<style scoped>

</style>
