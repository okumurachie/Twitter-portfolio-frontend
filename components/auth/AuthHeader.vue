<template>
    <header class="header">
        <div class="logo">
            <NuxtLink to="/">
                <img src="/images/logo.png" alt="ヘッダーロゴ" />
            </NuxtLink>
        </div>

        <nav class="nav">
            <NuxtLink to="/register">新規登録</NuxtLink>
            <NuxtLink to="/login">ログイン</NuxtLink>
        </nav>
    </header>
</template>

<style scoped>
.header {
    height: 64px;
    display: flex;
    justify-content: space-between;
    /* 両端配置 */
    align-items: center;
    background-color: #000;
    padding: 12px 30px;
}

.logo img {
    height: 40px;
}

.nav {
    display: flex;
    gap: 20px;
}

.nav a {
    color: #fff;
    text-decoration: none;
    font-size: 16px;
}

.nav a:hover {
    opacity: 0.8;
}
</style>
