<script setup lang="ts">

const { login, logout, user } = useAuth()

const payload = ref({
    email: '',
    password: ''
})

async function submit() {
    await login(payload.value.email, payload.value.password)

    payload.value.email = ''
    payload.value.password = ''
}
</script>

<template>
    <div class="p-5">
        <div v-if="user">
            User logged in

            {{ user }}

            <is-btn @click="logout">
                Logout  
            </is-btn>
        </div>
        <form
            v-else
            @submit.prevent="submit"
        >
            <input
                v-model="payload.email"
                type="email"
                placeholder="Email"
            >
            <input
                v-model="payload.password"
                type="password"
                placeholder="Password"
            >
            <button type="submit">
                Login
            </button>
        </form>
    </div>
</template>
