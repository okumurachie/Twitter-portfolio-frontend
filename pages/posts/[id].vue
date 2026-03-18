<template>
    <Message v-if="message" :message="message" :current-user-id="currentUserId" :show-detail-button="false" />
    <Comment :post-id="postId" />
</template>

<script setup>
import Message from '@/components/app/Message.vue'
import Comment from '@/components/app/Comment.vue'
import { useAuthStore } from '@/stores/auth'
import { useMessageStore } from '@/stores/messages'
import { useCommentStore } from '@/stores/comments'
import { computed, ref, watch, onMounted } from 'vue'

const route = useRoute()
const postId = computed(() => Number(route.params.id))

const auth = useAuthStore()
const messageStore = useMessageStore()
const commentStore = useCommentStore()

const currentUserId = computed(() => auth.userId)

const message = ref(null)

const config = useRuntimeConfig();

const fetchPost = async () => {
    try {
        console.log('postId:', postId.value)
        if (!postId.value) return

        const post = await $fetch(`${config.public.apiBase}/posts/${postId.value}`)
        console.log('取得成功:', post)
        message.value = {
            ...post,
            likes: post.likes_count ?? 0,
            liked: post.liked ?? false,
        }

    } catch (error) {
        console.error('エラー発生:', error)
    }
}

onMounted(() => {
    if (postId.value) {
        fetchPost()
        commentStore.fetchComments(postId.value)
    }
})

watch(postId, (newId) => {
    if (!newId) return
    fetchPost()
    commentStore.fetchComments(newId)
})

const onLike = () => {
    messageStore.toggleLike(postId.value)
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
