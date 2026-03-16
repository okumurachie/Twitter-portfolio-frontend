import { useAuthStore } from '@/stores/auth';
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

export const useMessages = () => {
    const auth = useAuthStore();
    const messages = useState<Message[]>('messages', () => []);

    const fetchMessages = async () => {
        try {
            const res = await $fetch<any[]>('http://localhost:8000/api/posts');
            messages.value = res.map((post) => ({
                id: post.id,
                content: post.content,
                user: post.user,
                likes: post.likes_count ?? post.likes?.length ?? 0,
                liked: post.liked ?? false,
                user_id: post.user_id,
            }));
        } catch (error) {
            console.error('投稿失敗', error);
        }
    };

    const createMessage = async (content: string) => {
        if (!auth.token) {
            return navigateTo('/login');
        }

        const res = await $fetch<any>('http://localhost:8000/api/posts', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${auth.token}`,
            },
            body: { content },
        });

        messages.value.unshift({
            id: res.id,
            content: res.content,
            user: res.user,
            likes: 0,
            liked: false,
            user_id: res.user_id,
        });

        return res;
    };
    const findMessage = (id: number): Message | undefined => {
        return messages.value.find((messages) => messages.id === Number(id));
    };

    const toggleLike = async (id: number) => {
        const authFirebase = getAuth();

        if (!authFirebase.currentUser) {
            return navigateTo('/login');
        }

        const target = findMessage(id);
        if (!target) return;

        if (target.loading) return;
        target.loading = true;

        try {
            const token = await authFirebase.currentUser.getIdToken();
            const res = await $fetch<any>(
                `http://localhost:8000/api/posts/${id}/like`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            target.liked = res.liked;
            target.likes = res.likes;
        } catch (error: any) {
            if (error.response?.status === 401) {
                return navigateTo('/login');
            }
            console.error('いいね失敗, error');
        } finally {
            target.loading = false;
        }
    };

    const deleteMessage = async (id: number) => {
        await $fetch(`http://127.0.0.1:8000/api/posts/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${auth.token}`,
            },
        });
    };

    return {
        messages,
        fetchMessages,
        findMessage,
        toggleLike,
        createMessage,
        deleteMessage,
    };
};
