'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/axios';
import type { AuthResponse, User } from '@/types';

// ─── Get current authenticated user ──────────────────────────────────────────
export function useUser() {
  return useQuery<User>({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: User }>('/user');
      return data.data;
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('token'),
    retry: false,
  });
}

// ─── Login ────────────────────────────────────────────────────────────────────
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await apiClient.post<AuthResponse>('/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      queryClient.setQueryData(['user'], data.user);
      router.push('/dashboard');
    },
  });
}

// ─── Register ─────────────────────────────────────────────────────────────────
export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      name: string;
      email: string;
      password: string;
      password_confirmation: string;
    }) => {
      const { data } = await apiClient.post<AuthResponse>('/register', payload);
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      queryClient.setQueryData(['user'], data.user);
      router.push('/dashboard');
    },
  });
}

// ─── Logout ───────────────────────────────────────────────────────────────────
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/logout');
    },
    onSettled: () => {
      localStorage.removeItem('token');
      queryClient.clear();
      router.push('/login');
    },
  });
}

// ─── Auth guard (client-side) ─────────────────────────────────────────────────
export function useRequireAuth() {
  const router = useRouter();
  const { data: user, isLoading, isError } = useUser();

  if (!isLoading && (isError || !user)) {
    router.push('/login');
  }

  return { user, isLoading };
}
