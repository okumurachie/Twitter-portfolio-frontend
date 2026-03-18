<template>
    <form class="post-box" @submit.prevent="onSubmit">
        <label for="textarea">シェア</label>
        <textarea class="post-box-input" v-model="message" placeholder="ここに記入" rows="8"
            :class="{ 'error': errors.message }" @focus="!auth.isLoggedIn && navigateTo('/login')"></textarea>
        <span v-if="errors.message" class="post-error-message">
            {{ errors.message }}
        </span>
        <div class="button-wrapper">
            <button class="post-button" type="submit" :disabled="!auth.isLoggedIn || props.isLoading">
                {{ props.isLoading ? '送信中...' : 'シェアする' }}
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useMessageStore } from '@/stores/messages'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const props = defineProps<{
    isLoading?: boolean
}>()

const auth = useAuthStore()
const messageStore = useMessageStore()

const schema = yup.object({
    message: yup
        .string()
        .required('投稿は入力必須です')
        .max(120, '120文字以内で入力してください')
})

const { handleSubmit, errors, resetForm } = useForm({
    validationSchema: schema
})

const { value: message } = useField('message')

const submitHandler = handleSubmit(async (values) => {
    if (!auth.token) return
    await messageStore.createMessage(values.message, auth.token)
    resetForm()
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
.post-box {
    width: 90%;
    margin: 0;
    display: flex;
    flex-direction: column;
}

.post-box * {
    box-sizing: border-box;
}

.post-box label {
    color: #fff;
    margin-bottom: 10px;
    font-size: 18px;
}

.post-box textarea {
    width: 100%;
    margin: 0 auto;
    resize: none;
    padding: 8px;
    border-radius: 8px;
    background-color: #000;
    border: 1px solid #fff;
    margin-bottom: 10px;
    font-size: 18px;
    color: #fff;
    transition: border-color 0.25s ease;
}

.post-box textarea:focus {
    outline: none;
    border-color: #1d9bf0;
}

.button-wrapper {
    width: 100%;
    display: flex;
    justify-content: flex-end;
}

.post-button {
    width: 40%;
    margin-top: 8px;
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

.post-button:hover {
    background: #156eaa;
    transform: translateY(-1px);
}

.post-box-input.error {
    border: 1px solid #e74c3c;
}

.post-error-message {
    padding-left: 10px;
    font-size: 14px;
    color: #e74c3c;
}
</style>
