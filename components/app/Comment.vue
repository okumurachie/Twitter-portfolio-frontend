<template>
    <div class="comment-item">
        <div class="comment-header">
            <h2 class="comment-title">コメント</h2>
        </div>
        <div class="comment-inner">
            <div class="comment-list">
                <div v-for="comment in comments" :key="comment.id" class="comment-body">
                    <div class="comment-body-wrapper">
                        <div class="user">{{ comment.user?.name }}</div>
                        <div class="content">{{ comment.content }}</div>
                    </div>
                </div>
            </div>
            <form class="comment-form" @submit.prevent="onSubmit">
                <div class="form-input">
                    <input class="comment-form-input" v-model="comment" type="text" placeholder="コメントを書く"
                        :class="{ 'error': errors.comment }" @focus="!auth.isLoggedIn && navigateTo('/login')" />
                    <span v-if="errors.comment" class="comment-error-message">
                        {{ errors.comment }}
                    </span>
                </div>
                <div class="form-button">
                    <button class="comment-button" type="submit" :disabled="!auth.isLoggedIn || isLoading">{{ isLoading
                        ? '送信中...' : 'コメント'
                        }}</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useForm, useField } from 'vee-validate'
import { useCommentStore } from '@/stores/comments'
import * as yup from 'yup'

const auth = useAuthStore()
const commentStore = useCommentStore()

const comments = computed(() => commentStore.comments)

const props = defineProps({
    postId: Number,
})

watch(
    () => commentStore.comments,
    (newComments) => {
        console.log('comments:', newComments)
    },
    { immediate: true }
)
const schema = yup.object({
    comment: yup
        .string()
        .required('コメントは入力必須です')
        .max(120, '120文字以内で入力してください')
})

const { handleSubmit, errors, resetForm } = useForm({
    validationSchema: schema
})

const { value: comment } = useField('comment')

const isLoading = ref(false)

const submitHandler = handleSubmit(async (values) => {
    isLoading.value = true

    try {
        await commentStore.createComment(
            props.postId,
            values.comment,
            auth.token
        )
        resetForm()
    } catch (error) {
        console.error('コメント送信エラー:', error)
        alert('コメント送信に失敗しました')
    } finally {
        isLoading.value = false
    }
})

const onSubmit = async () => {
    if (!auth.isLoggedIn) {
        await navigateTo('/login')
        return
    }

    await submitHandler()
}
</script>

<style scoped>
.comment-item {
    padding: 0;
    width: 100%;
    background-color: #000;
    border-bottom: 1px solid #fff;
    color: #fff;
}

.comment-inner,
.comment-list {
    padding: 0;
    width: 100%;
}

.comment-form {
    padding-top: 30px;
    width: 100%;
    height: 150px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-input {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
}

.comment-form-input {
    width: 90%;
    height: 30px;
    background-color: #000;
    border: 1px solid #fff;
    border-radius: 8px;
    padding: 10px;
    justify-content: center;
    color: #fff;
}

.form-button {
    width: 99%;
    display: flex;
    justify-content: flex-end;
}

.comment-body {
    padding: 0;
    border-bottom: 1px solid #fff;
}

.comment-body-wrapper {
    height: auto;
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.comment-header {
    height: 50px;
    display: flex;
    gap: 12px;
    border-bottom: 1px solid #fff;
}

.comment-title {
    width: 100%;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.comment-button {
    width: 100px;
    padding: 8px;
    border-radius: 20px;
    background: #1d9bf0;
    color: #fff;
    border: none;
    cursor: pointer;
    transition:
        background-color 0.25s ease,
        transform 0.15s ease;
}

.comment-button:hover {
    background: #156eaa;
    transform: translateY(-1px);
}

.user {
    font-size: 20px;
}

.content {
    font-size: 14px;
}

.comment-form-input.error {
    border: 1px solid #e74c3c;
}

.comment-error-message {
    width: 90%;
    text-align: left;
    font-size: 13px;
    color: #e74c3c;
}
</style>
