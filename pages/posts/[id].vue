<template>
    <Message v-if="message" :message="message" :current-user-id="currentUserId" :show-detail-button="false"
        @like="onLike" />
    <Comment :post-id="postId" :comments="comments" @submit="onSubmitComment" />
</template>

<script setup>
import Message from '@/components/app/Message.vue'
import Comment from '@/components/app/Comment.vue'
import { useAuthStore } from '@/stores/auth'
import { computed, ref, watch } from 'vue'

const route = useRoute()
const postId = computed(() => Number(route.params.id))

const auth = useAuthStore()
const currentUserId = computed(() => auth.userId)

const { toggleLike } = useMessages()

const message = ref(null)
const comments = ref([])

const fetchData = async () => {
    try {
        console.log('postId:', postId.value)
        if (!postId.value) return

        const post = await $fetch(`http://localhost:8000/api/posts/${postId.value}`)
        console.log('取得成功:', post)
        message.value = {
            ...post,
            likes: post.likes_count ?? 0,
            liked: post.liked ?? false,
        }

        const commentData = await $fetch(`http://localhost:8000/api/posts/${postId.value}/comments`)
        comments.value = commentData
    } catch (error) {
        console.error('エラー発生:', error)
    }
}

watch(postId, fetchData, { immediate: true })

const onLike = () => {
    toggleLike(postId.value)
}

const onSubmitComment = async (content) => {
    const newComment = await $fetch(`http://localhost:8000/api/posts/${postId.value}/comments`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${auth.token}`
        },
        body: { content }
    })

    comments.value.unshift(newComment)
}

definePageMeta({
    layout: 'app',
    title: 'コメント'
})
</script>

<style scoped>
.post-detail {
    padding: 0;
    margin: 0;
}
</style>
