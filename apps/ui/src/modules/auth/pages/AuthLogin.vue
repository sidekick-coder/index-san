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
        <is-card v-if="user">
            <is-card-head>
                <is-card-title>
                    Logged as {{ user.email }}
                </is-card-title>
            </is-card-head>

            <is-card-content>
                <is-btn @click="logout">
                    Logout
                </is-btn>
            </is-card-content>
        </is-card>

        <form
            v-else
            @submit.prevent="submit"
        >
            <is-card>
                <is-card-head>
                    <is-card-title>
                        Login
                    </is-card-title>
                </is-card-head>
                <is-card-content class="flex flex-col gap-y-4">
                    <is-text-field
                        v-model="payload.email"
                        label="Email"
                    />
                    <is-text-field
                        v-model="payload.password"
                        label="Password"
                        type="password"
                    />

                    <is-btn type="submit">
                        Login
                    </is-btn>
                </is-card-content>
            </is-card>
        </form>
    </div>
</template>
