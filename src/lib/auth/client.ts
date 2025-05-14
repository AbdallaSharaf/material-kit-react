'use client';

import type { User } from '@/types/user';

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    return { error: 'Sign Up not implemented' };
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { email, password } = params;

    // Make API request

    const res = await fetch(`https://fruits-heaven-api.onrender.com/api/v1/auth/SignIn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || 'Invalid credentials' };
    }
    if (!data.token) {
      return { error: 'Invalid credentials' };
    }
    const issuedAt = Date.now();
    localStorage.setItem('auth-token-issued-at', issuedAt.toString());
    localStorage.setItem('custom-auth-token', data.token);
    return {};
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    const token = localStorage.getItem('custom-auth-token');
    const issuedAt = localStorage.getItem('auth-token-issued-at');
  
    if (!token || !issuedAt) {
      return { data: null }; // Not logged in
    }
  
    const issuedAtTime = parseInt(issuedAt, 10);
    const now = Date.now();
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
  
    if (now - issuedAtTime > sevenDaysInMs) {
      // Token expired
      localStorage.removeItem('custom-auth-token');
      localStorage.removeItem('auth-token-issued-at');
  
      // Optional: Trigger logout UI or redirect
      return { data: null, error: 'Session expired. Please log in again.' };
    }
  
    // Token is valid — proceed with fetch
    const res = await fetch(`https://fruits-heaven-api.onrender.com/api/v1/user/myData`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      return { error: data.message, data: null };
    }
  
    return { data };
  }
  

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');

    return {};
  }
}

export const authClient = new AuthClient();
