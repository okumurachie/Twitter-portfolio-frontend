import { useAuthStore } from '@/stores/auth';
import { defineStore } from 'pinia';
import { getAuth } from 'firebase/auth';

interface User {
    id: number;
    name: string;
}

interface Message {
    id: number;
    content: string;
    user: User;
    user_id: number;
    likes: number;
    liked: boolean;
    loading?: boolean;
}

export const useMessageStore = defineStore('messages', {
    state: () => ({
        messages: [] as Message[],
    }),

    actions: {
        async fetchMessages() {
            const config = useRuntimeConfig();

            try {
                const res = await $fetch<any[]>(
                    `${config.public.apiBase}/posts`,
                );

                this.messages = res.map((post: any) => ({
                    id: post.id,
                    content: post.content,
                    user: post.user,
                    likes: post.likes_count ?? 0,
                    liked: post.liked ?? false,
                    user_id: post.user_id,
                }));
            } catch (error) {
                console.error('投稿失敗', error);
            }
        },

        async createMessage(content: string, token: string) {
            const config = useRuntimeConfig();

            if (!token) {
                return navigateTo('/login');
            }

            const res = await $fetch<any>(`${config.public.apiBase}/posts`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: { content },
            });

            this.messages.unshift({
                id: res.id,
                content: res.content,
                user: res.user,
                likes: 0,
                liked: false,
                user_id: res.user_id,
            });

            return res;
        },

        findMessage(id: number) {
            return this.messages.find((messages) => messages.id === Number(id));
        },

        async toggleLike(id: number) {
            const auth = useAuthStore();
            const config = useRuntimeConfig();

            if (!auth.token) {
                return navigateTo('/login');
            }

            const target = this.findMessage(id);
            if (!target) return;

            if (target.loading) return;
            target.loading = true;

            try {
                const res = await $fetch<any>(
                    `${config.public.apiBase}/posts/${id}/like`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${auth.token}`,
                        },
                    },
                );
                target.liked = res.liked;
                target.likes = res.likes;
            } catch (error: any) {
                if (error.response?.status === 401) {
                    return navigateTo('/login');
                }
                console.error('いいね失敗', error);
            } finally {
                target.loading = false;
            }
        },

        async deleteMessage(id: number, token: string) {
            const config = useRuntimeConfig();
            await $fetch(`${config.public.apiBase}/posts/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            this.messages = this.messages.filter(
                (messages) => messages.id !== id,
            );
        },
    },
});
