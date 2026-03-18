<template>
    <div v-if="isOpen" class="overlay" @click="emit('close')"></div>

    <aside :class="['sidebar', { open: isOpen }]">
        <button class="close-button" @click="emit('close')">×</button>
        <div class="logo">
            <img src="/images/logo.png" alt="サイドバーヘッダー" />
        </div>
        <div class="sidebar-content">
            <nav class="menu">
                <NuxtLink to="/" class="menu-item" @click="emit('close')">
                    <img src="/images/home.png" alt="ホームアイコン" class="menu-icon" />
                    <span>ホーム</span>
                </NuxtLink>
            </nav>
            <div v-if="loading" class="auth-loading">
                読み込み中...
            </div>
            <button v-else-if="isLoggedIn" class="logout" @click="handleLogout">
                <img src="/images/logout.png" alt="ログアウトアイコン" class="menu-icon" />
                <span>ログアウト</span>
            </button>
            <button v-else class="logout" @click="handleLogin">
                <img src="/images/logout.png" alt="ログインアイコン" class="menu-icon" />
                <span>ログイン</span>
            </button>
            <PostForm />
        </div>
    </aside>
</template>

<script setup lang="ts">
import { signOut } from 'firebase/auth'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import PostForm from '@/components/app/PostForm.vue'

defineProps({
    isOpen: Boolean
})

const auth = useAuthStore()

const emit = defineEmits(['close'])


const isLoggedIn = computed(() => auth.isLoggedIn)
const loading = computed(() => auth.loading)

const handleLogout = async () => {
    try {
        const { $auth } = useNuxtApp()
        await signOut($auth)
        emit('close')
        auth.user = null
        auth.token = null

        await navigateTo('/')
    } catch (error) {
        console.error('ログアウトエラー:', error)
        alert('ログアウトに失敗しました')
    }
}

const handleLogin = () => {
    emit('close')
    navigateTo('/login')
}
</script>

<style scoped>
.sidebar {
    width: 280px;
    padding: 16px;
    box-sizing: border-box;
}

.logo {
    width: 40%;
    margin: 20px 0 20px 20px;
}

.logo img {
    width: 100%;
}

.sidebar-content {
    display: flex;
    flex-direction: column;
    padding-left: 20px;
}

.menu-item,
.logout {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    text-decoration: none;
    color: #fff;
}

.menu-icon {
    width: 20px;
    height: 20px;
}

.logout {
    margin: 20px 0;
    padding: 0;
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
}

.close-button {
    display: none;
}

.overlay {
    display: none;
}

@media (max-width: 767px) {
    .overlay {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background-color: #000;
        z-index: 999;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
    }

    .overlay {
        opacity: 1;
        pointer-events: auto;
    }

    .sidebar {
        position: fixed;
        top: 0;
        left: -80%;
        width: 80%;
        height: 100vh;
        z-index: 1000;
        transition: left 0.3s ease;
        border-right: 1px solid #fff;
    }

    .sidebar.open {
        left: 0;
    }

    .close-button {
        display: block;
        position: absolute;
        top: 16px;
        right: 16px;
        font-size: 32px;
        background: none;
        border: none;
        color: #fff;
        cursor: pointer;
        padding: 0;
        width: 32px;
        height: 32px;
        line-height: 1;
    }
}
</style>
