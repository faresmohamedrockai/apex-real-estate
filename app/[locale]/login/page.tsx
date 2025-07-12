'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import Image from 'next/image';
import { useRef } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { locale } = useParams(); // 👈 علشان نوجه المستخدم حسب اللغة

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');
    setSuccess("");
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (res?.ok) {
        setSuccess("تم تسجيل الدخول بنجاح");
        setTimeout(() => {
          router.push(`/${locale}/dashboard`);
        }, 1000);
      } else {
        setError('Email or password is incorrect');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-[#b70501]">
      <div className="w-full max-w-xl p-10 border border-neutral-700 rounded-2xl shadow-2xl  bg-neutral-800 relative">
        <div className="absolute left-8 top-8">
          <Image src="/logo.png" alt="Logo" width={60} height={60} className="rounded-full" />
        </div>
        <h1 className="text-4xl font-extrabold mb-8 text-center text-white">Login</h1>

        {error && (
          <div className="bg-red-600 text-white p-3 mb-6 rounded text-lg text-center font-semibold">{error}</div>
        )}
        {success && (
          <div className="bg-green-600 text-white p-3 mb-6 rounded text-lg text-center font-semibold">{success}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-8" ref={formRef}>
          <div>
            <Label htmlFor="email" className="block mb-2 text-lg text-white font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              className="w-full py-4 px-4 text-lg bg-[#b70501] border-neutral-700 text-white placeholder:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="block mb-2 text-lg text-white font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              className="w-full py-4 px-4 text-lg bg-[#b70501]  border-neutral-700 text-white placeholder:text-white  rounded-lg focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full  bg-[#b70501] cursor-pointer hover:bg-neutral-950 text-white py-4 text-xl rounded-lg font-bold  transition-colors shadow-lg flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading && (
              <span className="animate-spin inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full"></span>
            )}
            {loading ? 'جاري الدخول...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
