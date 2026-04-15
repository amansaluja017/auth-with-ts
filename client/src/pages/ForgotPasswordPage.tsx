import { Link, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  
  const { register, handleSubmit } = useForm<{ email: string }>();

  const submit = async (data: { email: string }) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_ENDPOINT}/customer/forgot-password`, { email: data.email }, {withCredentials: true});
      navigate('/');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.data.message) {
          setError(error.response.data.message);
        }
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-[2rem] border border-slate-700 bg-slate-900/95 p-8 shadow-glow backdrop-blur-xl">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Password reset</p>
          <h1 className="text-3xl font-semibold text-slate-100">Forgot your password?</h1>
          <p className="text-slate-400">
            Enter the email linked to your account and we’ll send a secure reset flow.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(submit)}>
          <label className="block">
            <span className="text-sm text-slate-300">Email address</span>
            <input
              type="email"
              required
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              placeholder="you@example.com"
              {...register("email", { required: true })}
            />
          </label>
          
          {error && (
            <p className="text-sm text-red-600 font-mono font-bold">{error}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-2xl bg-cyan-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Send reset link
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Remembered your password?{' '}
          <Link className="font-medium text-cyan-300 hover:text-cyan-200" to="/login">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}

export default ForgotPasswordPage;
