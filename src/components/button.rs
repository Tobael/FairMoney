use leptos::prelude::*;

#[component]
pub fn Button(text: ReadSignal<String>) -> impl IntoView {
    view! { <button>{text}</button> }
}
