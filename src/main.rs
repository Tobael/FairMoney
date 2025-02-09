mod app;
mod components;
mod logic;
mod views;

use app::App;
use leptos::prelude::*;
// use crate::logic::blockchain::{generate_keypair, Blockchain, Transaction};

fn main() {
    console_error_panic_hook::set_once();
    mount_to_body(App)

    // let mut chain = Blockchain::new();
    // let transaction = Transaction::new(String::from("Tobi"), String::from("Michi"), 100.0);
    // let (private_key, public_key) = generate_keypair();
    //
    // chain.add_block(private_key, public_key.clone(), vec![transaction], Vec::new());
    // let last_block = chain.blocks.last().unwrap();
    //
    // println!("{:?}", chain);
}
