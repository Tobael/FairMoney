use leptos::prelude::*;
use rsa::pkcs1::{EncodeRsaPrivateKey, LineEnding};
use rsa::pkcs8::EncodePublicKey;
use crate::logic::blockchain::{generate_keypair};

#[component]
pub fn GroupCreate() -> impl IntoView {
    let (private_key, public_key) = generate_keypair();
    let private_key_pem = private_key.to_pkcs1_pem(LineEnding::LF).unwrap().to_string();
    let public_key_pem = public_key.to_public_key_pem(LineEnding::LF).unwrap().to_string();

    window().local_storage().ok().flatten().and_then(|storage| {
        storage.set_item("private_key", &private_key_pem).unwrap();
        storage.set_item("public_key", &public_key_pem).unwrap();
        Some(storage)
    });


    view! {
        <h1>"Gruppe erstellen"</h1>
    }
}
