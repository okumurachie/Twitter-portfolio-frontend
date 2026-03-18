<template>
    <div class="message-content">
        <Message v-for="message in messages" :key="message.id" :message="message" :current-user-id="currentUserId" />
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'app',
    title: 'ホーム'
})

import Message from '@/components/app/Message.vue'
import { useAuthStore } from '@/stores/auth'
import { useMessageStore } from '@/stores/messages'
import { computed } from 'vue'
import { watch } from 'vue'

const auth = useAuthStore()

const currentUserId = computed(() => auth.userId)

watch(
    () => auth.token,
    async (token) => {
        console.log('token changed:', token)

        if (token) {
            const me = await auth.fetchMe()
            console.log('Laravel response:', me)
        }
    },
    { immediate: true }
)

const messageStore = useMessageStore()

const messages = computed(() => messageStore.messages)

onMounted(async () => {
    await messageStore.fetchMessages()
    console.log('messages:', messageStore.messages)

})

</script>

<style scoped>
.message-content {
    padding: 0;
    margin: 0;
}
</style>
