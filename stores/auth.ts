import { defineStore } from 'pinia';
import {
    getAuth,
    onAuthStateChanged,
    type User as FirebaseUser,
} from 'firebase/auth';

type LaravelUser = {
    id: number;
    name: string;
    email: string;
};

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as FirebaseUser | null,
        token: null as string | null,
        laravelUser: null as LaravelUser | null,
        loading: true,
    }),

    getters: {
        isLoggedIn: (state) => !!state.user,
        userId: (state) => state.laravelUser?.id ?? null,
    },

    actions: {
        initAuth() {
            const auth = getAuth();

            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    this.user = user;
                    this.token = await user.getIdToken(true);
                    await this.fetchMe();
                } else {
                    this.user = null;
                    this.token = null;
                    this.laravelUser = null;
                }
                this.loading = false;
            });
        },

        async fetchMe() {
            if (!this.token) {
                return null;
            }

            try {
                const res = await $fetch<LaravelUser>(
                    'http://127.0.0.1:8000/api/user',
                    {
                        headers: {
                            Authorization: `Bearer ${this.token}`,
                        },
                    },
                );
                console.log('Laravel user:', res);

                this.laravelUser = res;
                return res;
            } catch (error) {
                console.error('fetchMe error:', error);
                return null;
            }
        },
    },
});
