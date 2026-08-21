import "@fontsource/public-sans/400.css";
import "@fontsource/public-sans/500.css";
import "@fontsource/public-sans/700.css";
import "flag-icons/css/flag-icons.min.css";
import "./app.css";

import { mount } from "svelte";

import App from "./App.svelte";
import { newTab } from "./lib/tabs.svelte.js";

newTab();

export default mount(App, { target: document.body });
