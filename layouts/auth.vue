<template>
    <div class="auth-layout">
        <AuthHeader />
        <main class="auth-main">
            <slot />
        </main>
    </div>
</template>

<style scoped>
.auth-layout {
    min-height: 100vh;
    background-color: #000;
}

.auth-main {
    min-height: calc(100vh - 64px);
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
