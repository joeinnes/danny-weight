<script lang="ts">
	import { goto } from '$app/navigation';
	import { directus } from '../lib/db';

	let user = {
		email: '',
		password: ''
	};

	const login = async () => {
		try {
			await directus.auth.login(user);
			goto('/');
		} catch (e) {
			alert('Could not log in');
		}
	};
</script>

<div class="min-h-screen flex flex-col justify-center">
	<div class="card bg-base-100 shadow-xl mx-auto max-w-prose w-full">
		<div class="card-body">
			<h1 class="card-title">Log In</h1>
			<form on:submit|preventDefault={login}>
				<div class="form-control">
					<label class="label" for="email">
						<span class="label-text">Email</span>
					</label>
					<input
						type="email"
						name="email"
						id="email"
						required
						bind:value={user.email}
						class="input input-bordered input-lg w-full"
					/>
				</div>
				<div class="form-control">
					<label for="password" class="label">
						<span class="label-text">Password</span>
					</label>
					<input
						type="password"
						name="password"
						id="password"
						required
						bind:value={user.password}
						class="input input-bordered input-lg w-full"
					/>
				</div>
				<div class="py-4">
					<input type="submit" class="btn btn-lg btn-block" value="Log In" />
				</div>
			</form>
		</div>
	</div>
</div>
