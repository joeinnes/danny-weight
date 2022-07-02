<script lang="ts">
	import { goto } from '$app/navigation';
	import { directus } from '../lib/db';

  let user = {
    email: '',
    password: ''
  }
  
  const login = async () => {
    try {
      await directus.auth.login(user);
      goto('/')
    } catch (e) {
      alert('Could not log in')
    }
  }
</script>

<section>
<h1>Log In</h1>
<form on:submit|preventDefault={login}>
  <label for="email">
    Email
    <input type="email" name="email" id="email" required bind:value={user.email} />
  </label>
  <label for="password">
    Password
    <input type="password" name="password" id="password" required bind:value={user.password} />
  </label>
  <button type="submit">Log in</button>
  </form>
</section>