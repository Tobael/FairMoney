import { Block } from '@/logic/Block.ts'
import type { Transaction } from '@/logic/Transaction.ts'
import { useBlockchainStore } from '@/stores/blockchain.ts'

type BlockchainLike = Blockchain

export class Blockchain {
  blocks: Block[] = []

  async export(name: string, publicKey: CryptoKey, privateKey: CryptoKey) {
    const blockchainStore = useBlockchainStore()
    const publicKeyJwk = await window.crypto.subtle.exportKey('jwk', publicKey)
    const privateKeyJwk = await window.crypto.subtle.exportKey('jwk', privateKey)
    const privateKeyHash = await hashPrivateKey(privateKey)
    blockchainStore.upsertBlockchain(name, privateKeyJwk, privateKeyHash, publicKeyJwk, this)
  }

  static from(data: BlockchainLike): Blockchain {
    const blockchain = new Blockchain()
    blockchain.blocks = data.blocks.map((blockData) => Block.from(blockData))

    return blockchain
  }

  async addBlock(keyPair: CryptoKeyPair, transactions: Transaction[], validators: string[]) {
    let block: Block
    if (!this.blocks.length) {
      const publicKey = await window.crypto.subtle.exportKey('jwk', keyPair.publicKey)
      block = new Block(0, 'GENESIS', transactions, [JSON.stringify(publicKey)])
    } else {
      block = new Block(
        this.blocks.length,
        this.blocks[this.blocks.length - 1].hash,
        transactions,
        validators,
      )
    }

    block.hash = await hashBlock(block)
    block.signature = await signBlock(keyPair.privateKey, block)
    this.blocks.push(block)
  }
}

export async function hashPrivateKey(privateKey: CryptoKey) {
  const encoder = new TextEncoder()
  const privateKeyJwk = await window.crypto.subtle.exportKey('jwk', privateKey)
  const data = encoder.encode(JSON.stringify(privateKeyJwk))
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function generateKeypair(): Promise<CryptoKeyPair> {
  return await window.crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify'],
  )
}

export async function hashBlock(block: Block): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(JSON.stringify(block))
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function signBlock(privateKey: CryptoKey, block: Block): Promise<string> {
  const hash = await hashBlock(block)
  const encoder = new TextEncoder()
  const data = encoder.encode(hash)
  const signature = await window.crypto.subtle.sign({ name: 'RSASSA-PKCS1-v1_5' }, privateKey, data)

  return bufferToBase64(signature)
}

export async function verifySignature(
  publicKey: CryptoKey,
  hash: string,
  signature_text: string,
): Promise<boolean> {
  const encoder = new TextEncoder()
  const data = encoder.encode(hash)
  return await window.crypto.subtle.verify(
    { name: 'RSASSA-PKCS1-v1_5' },
    publicKey,
    base64ToBuffer(signature_text),
    data,
  )
}

function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  return btoa(String.fromCharCode(...bytes))
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}
