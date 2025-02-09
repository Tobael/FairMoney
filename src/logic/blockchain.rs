use chrono::Utc;
use rand::{thread_rng};
use rsa::{Pkcs1v15Sign, RsaPrivateKey, RsaPublicKey};
use rsa::pkcs1::LineEnding;
use rsa::pkcs1v15::{Signature, SigningKey, VerifyingKey};
use rsa::pkcs8::EncodePublicKey;
use rsa::signature::{Signer, Verifier};
use sha2::{Digest, Sha256};
use serde::{Deserialize, Serialize};

pub fn generate_keypair() -> (RsaPrivateKey, RsaPublicKey) {
    let mut rng = thread_rng();
    let private_key = RsaPrivateKey::new(&mut rng, 2048).unwrap();
    let public_key = RsaPublicKey::from(&private_key);

    (private_key, public_key)
}

#[derive(Debug)]
pub struct Blockchain {
    pub blocks: Vec<Block>,
    authorities: Vec<String>,
}

impl Blockchain {
    pub fn new() -> Self {
        Self {
            blocks: Vec::new(),
            authorities: Vec::new(),
        }
    }

    pub fn add_block(
        &mut self,
        private_key: RsaPrivateKey,
        public_key: RsaPublicKey,
        transactions: Vec<Transaction>,
        validators: Vec<String>,
    ) {
        let mut block = match self.blocks.is_empty() {
            true => {
                Block {
                    transactions,
                    validator: public_key.to_public_key_pem(LineEnding::LF).unwrap().to_string(),
                    validators: vec![public_key.to_public_key_pem(LineEnding::LF).unwrap().to_string()],
                    ..Default::default()
                }
            }
            false => {
                Block {
                    index: self.blocks.len(),
                    previous_hash: self.blocks.last().unwrap().hash.clone(),
                    transactions,
                    validators,
                    validator: public_key.to_public_key_pem(LineEnding::LF).unwrap().to_string(),
                    ..Default::default()
                }
            }
        };
        block.hash = Self::hash_block(&block);
        block.signature = Self::sign_block(private_key, &block);
        self.blocks.push(block);
    }

    pub fn hash_block(block: &Block) -> String {
        let block_data = serde_json::to_string(block).unwrap();
        let mut hasher = Sha256::new();
        hasher.update(block_data);
        format!("{:x}", hasher.finalize())
    }

    pub fn sign_block(private_key: RsaPrivateKey, block: &Block) -> String {
        let hash = Self::hash_block(block);
        let signing_key = SigningKey::<Sha256>::new(private_key);
        signing_key.sign(hash.as_bytes()).to_string()
    }

    pub fn verify_block_signature(public_key: RsaPublicKey, block: &Block) -> bool {
        // let hash = block.hash.clone();
        // let verifying_key = VerifyingKey::<Sha256>::new(public_key);
        // verifying_key.verify(hash.as_bytes())
        true
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Block {
    index: usize,
    timestamp: u64,
    previous_hash: String,
    hash: String,
    transactions: Vec<Transaction>,
    validators: Vec<String>,
    validator: String,
    signature: String,
}

impl Default for Block {
    fn default() -> Self {
        Self {
            index: 0,
            timestamp: Utc::now().timestamp() as u64,
            previous_hash: "".to_string(),
            hash: "".to_string(),
            transactions: vec![],
            validators: vec![],
            validator: "".to_string(),
            signature: "".to_string(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Transaction {
    sender: String,
    recipient: String,
    amount: f64,
}

impl Transaction {
    pub fn new(sender: String, recipient: String, amount: f64) -> Self {
        Transaction {
            sender,
            recipient,
            amount,
        }
    }
}
