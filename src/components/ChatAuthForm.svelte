<script>
  import { login, signup } from "../lib/chat.svelte.js";

  let mode = $state("login");
  let username = $state("");
  let password = $state("");
  let agreedToLegal = $state(false);
  let error = $state(null);
  let busy = $state(false);

  const ERROR_MESSAGES = {
    invalid_username:
      "Usernames are 3-20 characters (letters, numbers, underscore), can't be all numbers, and can have at most 8 digits.",
    invalid_password: "Password must be at least 8 characters.",
    must_agree_to_legal: "You need to agree to the terms and privacy policy.",
    username_taken: "That username is already taken.",
    invalid_credentials: "Wrong username or password.",
    rate_limited: "Too many attempts. Try again later.",
    banned: "This account has been banned.",
  };

  async function submit(event) {
    event.preventDefault();
    error = null;
    busy = true;
    try {
      if (mode === "signup") await signup(username, password, agreedToLegal);
      else await login(username, password);
    } catch (err) {
      error = ERROR_MESSAGES[err.message] ?? "Something went wrong.";
    } finally {
      busy = false;
    }
  }

  function toggleMode() {
    mode = mode === "login" ? "signup" : "login";
    error = null;
  }
</script>

<form id="chatAuthForm" onsubmit={submit}>
  <label>
    <span>Username</span>
    <input type="text" bind:value={username} autocomplete="username" required />
  </label>
  <label>
    <span>Password</span>
    <input
      type="password"
      bind:value={password}
      autocomplete={mode === "signup" ? "new-password" : "current-password"}
      required
    />
  </label>

  {#if mode === "signup"}
    <label class="checkbox">
      <input type="checkbox" bind:checked={agreedToLegal} />
      <span>
        I agree to the
        <a href="/legal/terms.html" target="_blank" rel="noopener">Terms</a>
        and
        <a href="/legal/privacy.html" target="_blank" rel="noopener">Privacy Policy</a>
      </span>
    </label>
  {/if}

  {#if error}
    <p class="chatError">{error}</p>
  {/if}

  <button class="btn" type="submit" disabled={busy || (mode === "signup" && !agreedToLegal)}>
    {mode === "signup" ? "Sign up" : "Log in"}
  </button>

  <button type="button" class="chatModeToggle" onclick={toggleMode}>
    {mode === "signup" ? "Already have an account? Log in" : "Need an account? Sign up"}
  </button>
</form>
