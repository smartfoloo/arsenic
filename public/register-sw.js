"use strict";
/**
 * Distributed with Ultraviolet and compatible with most configurations.
 */
const stockSW = "/uv.sw.js";

/**
 * List of hostnames that are allowed to run serviceworkers on http:
 */
const swAllowedHostnames = ["localhost", "127.0.0.1"];

/**
 * Global util
 * Used in 404.html and index.html
 */

async function registerSW() {
  if (
    location.protocol !== "https:" &&
    !swAllowedHostnames.includes(location.hostname)
  )
    throw new Error("Service workers cannot be registered without https.");

  if (!navigator.serviceWorker)
    throw new Error("Your browser doesn't support service workers.");

  const proxyType = localStorage.getItem('proxy-backend');

  if (proxyType === "dynamic") {
    await navigator.serviceWorker.register("/dynamic.sw.js", {
      scope: "/service/dynamic/",
    });
  } else if (proxyType === "scramjet") {
    await navigator.serviceWorker.register("/scramjet.sw.js", {
      scope: "/service/scramjet/",
    });
  } else {
    await navigator.serviceWorker.register(stockSW, {
      scope: "/service/uv/",
    });
  }
}
