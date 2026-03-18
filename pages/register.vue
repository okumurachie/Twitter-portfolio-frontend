<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'

definePageMeta({
    layout: 'auth'
})

const { $auth } = useNuxtApp()

const schema = yup.object({
    username: yup
        .string()
        .required('ユーザーネームを入力してください')
        .max(20, 'ユーザーネームは20文字以内で入力してください'),
    email: yup
        .string()
        .required('メールアドレスを入力してください')
        .email('正しいメール形式で入力してください'),
    password: yup
        .string()
        .required('パスワードを入力してください')
        .min(6, 'パスワードは6文字以上で入力してください')
})

const { handleSubmit, errors } = useForm({
    validationSchema: schema
})

const { value: username } = useField('username')
const { value: email } = useField('email')
const { value: password } = useField('password')

const isLoading = ref(false)

const onSubmit = handleSubmit(async (values) => {
    isLoading.value = true
    const config = useRuntimeConfig();

    try {
        const userCredential = await createUserWithEmailAndPassword(
            $auth,
            values.email,
            values.password
        )
        await updateProfile(userCredential.user, {
            displayName: values.username
        })
        const idToken = await userCredential.user.getIdToken(true)

        await $fetch(`${config.public.apiBase}/user/update-name`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${idToken}` },
            body: { name: values.username }
        })

        await navigateTo('/')
    } catch (error: any) {
        console.error('新規登録エラー:', error)
        if (error.code === 'auth/email-already-in-use') {
            alert('このメールアドレスは既に使用されています')
        } else {
            alert('新規登録に失敗しました')
        }
    } finally {
        isLoading.value = false
    }
})
</script>

<template>
    <AuthCard>
        <h2 class="title">新規登録</h2>
        <form class="form" @submit.prevent="onSubmit">
            <div class="form-group">
                <input v-model="username" type="text" placeholder="ユーザーネーム" :class="{ 'error': errors.username }" />
                <span v-if="errors.username" class="error-message">
                    {{ errors.username }}
                </span>
            </div>
            <div class="form-group">
                <input v-model="email" type="email" placeholder="メールアドレス" :class="{ 'error': errors.email }" />
                <span v-if="errors.email" class="error-message">
                    {{ errors.email }}
                </span>
            </div>
            <div class="form-group">
                <input v-model="password" type="password" placeholder="パスワード" :class="{ 'error': errors.password }" />
                <span v-if="errors.password" class="error-message">
                    {{ errors.password }}
                </span>
            </div>
            <button type="submit" :disabled="isLoading">
                {{ isLoading ? '登録中...' : '新規登録' }}
            </button>
        </form>
    </AuthCard>
</template>

<style scoped>
.register-card {
    margin: 100px auto;
    width: 35%;
    min-width: 320px;
    background: #fff;
    color: #000;
    padding: 20px 32px;
    border-radius: 8px;
}

.title {
    text-align: center;
    margin-top: 15px;
    margin-bottom: 15px;
}

.form {
    display: flex;
    flex-direction: column;
    padding: 10px;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}
</style>
