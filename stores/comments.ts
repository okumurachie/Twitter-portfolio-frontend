import { useAuthStore } from '@/stores/auth';
import { defineStore } from 'pinia';
import { useRuntimeConfig } from '#app';

interface User {
    id: number;
    name: string;
}

interface Comment {
    id: number;
    content: string;
    user: User;
    user_id: number;
    post_id: number;
}

export const useCommentStore = defineStore('comments', {
    state: () => ({
        comments: [] as Comment[],
    }),

    actions: {
        async fetchComments(postId: number) {
            const config = useRuntimeConfig();

            try {
                const res = await $fetch<any[]>(
                    `${config.public.apiBase}/posts/${postId}/comments`,
                );

                console.log('API結果:', res);

                this.comments = res;
            } catch (error) {
                console.error('コメント取得失敗', error);
            }
        },

        async createComment(postId: number, content: string, token?: string) {
            const config = useRuntimeConfig();

            try {
                const res = await $fetch<any>(
                    `${config.public.apiBase}/posts/${postId}/comments`,
                    {
                        method: 'POST',
                        body: { content },
                        headers: token
                            ? {
                                  Authorization: `Bearer ${token}`,
                              }
                            : {},
                    },
                );

                this.comments.unshift(res);
            } catch (error) {
                console.error('コメント投稿失敗', error);
                throw error;
            }
        },
    },
});
