<template>
    <div class="message-item">
        <div class="message-inner">
            <div class="message-header">
                <span class="username">
                    {{ message.user?.name }}
                </span>

                <div class="actions">
                    <button class="icon-button" @click="toggleLike(message.id)">
                        <img src="/images/heart.png" alt="like" class="heart" :class="{ liked: message.liked }" />
                        <span v-if="message.likes >= 0" class="like-count">{{ message.likes }}</span>
                    </button>

                    <button v-if="isMyPost" type="button" class="icon-button" @click="deletePost">
                        <img src="/images/cross.png" alt="delete" />
                    </button>

                    <NuxtLink v-if="showDetailButton" :to="`/posts/${message.id}`" class="icon-button">
                        <img src="/images/detail.png" alt="create" />
                    </NuxtLink>
                </div>
            </div>

            <div class="message-body">
                {{ message.content }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useMessageStore } from '@/stores/messages'

const messageStore = useMessageStore()
const auth = useAuthStore()

const props = defineProps({
    message: {
        type: Object,
        required: true
    },
    currentUserId: {
        type: Number,
        default: null
    },
    showDetailButton: {
        type: Boolean,
        default: true
    }
})

const isMyPost = computed(() => {
    console.log({
        postUserId: props.message.user_id,
        currentUserId: props.currentUserId,
        result: Number(props.message.user_id) === Number(props.currentUserId)
    })

    return props.message.user_id == props.currentUserId
})

const emit = defineEmits(['deleted'])

const toggleLike = () => {
    messageStore.toggleLike(props.message.id)
}

const deletePost = async () => {
    await messageStore.deleteMessage(props.message.id, auth.token)
    emit('deleted', props.message.id)
}
</script>

<style scoped>
.message-item {
    width: 100%;
    background-color: #000;
    border-bottom: 1px solid #fff;
}

.message-inner {
    padding: 16px 18px;
    color: #fff;

}

.message-header {
    display: flex;
    gap: 12px;
}

.username {
    font-weight: bold;
    font-size: 24px;
}

.actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.icon-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
}

.like-count {
    color: #fff;
}

.icon-button img {
    width: 24px;
    height: 24px;
}

.heart {
    width: 24px;
    height: 24px;
    transition: filter 0.2s ease, transform 0.15s ease;
}

.heart.liked {
    filter: invert(27%) sepia(82%) saturate(4000%) hue-rotate(330deg) brightness(95%) contrast(105%);
}

.icon-button:active .heart {
    transform: scale(1.2);
}

.like-count {
    font-size: 18px;
}

.message-body {
    margin-top: 6px;
    font-size: 14px;
    line-height: 1.6;
    color: #e7e9ea;
    white-space: pre-wrap;
}
</style>
