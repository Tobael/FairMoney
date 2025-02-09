use crate::views::group_create::GroupCreate;
use crate::views::home::Home;
use leptos::prelude::*;
use leptos_router::components::{Route, Router, Routes};
use leptos_router::path;

#[component]
pub fn App() -> impl IntoView {
    view! {
        <Router>
            <main>
                <Routes fallback=|| "Not found">
                    <Route path=path!("/") view=Home />
                    <Route path=path!("/group/create") view=GroupCreate />
                </Routes>
            </main>
        </Router>
    }
}
