import { Link, useNavigate, useParams } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import PasswordInput from '../components/PasswordInput';
import { useState } from 'react';

function NewPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<{ newPassword: string, confirmPassword: string }>();
  const { token } = useParams();
  
  const submit = async (data: { newPassword: string, confirmPassword: string }) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      await axios.post(`${import.meta.env.VITE_API_ENDPOINT}/customer/new-password/${token}`, data, {withCredentials: true});
      navigate('/login');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.data.message) {
          setError(error.response.data.message);
        } else {
          setError("Password reset failed. Please try again.");
        }
      } else {
        setError("Password reset failed. Please try again.");
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-[2rem] border border-slate-700 bg-slate-900/95 p-8 shadow-glow backdrop-blur-xl">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Secure reset</p>
          <h1 className="text-3xl font-semibold text-slate-100">Create a new password</h1>
          <p className="text-slate-400">
            Choose a strong password for your booking account. Your next login will use the updated credentials.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(submit)}>
          <PasswordInput
            label="New password"
            placeholder="Enter new password"
            register={register('newPassword', { required: true })}
          />

          <PasswordInput
            label="Confirm password"
            placeholder="Confirm new password"
            register={register('confirmPassword', { required: true })}
          />
          
          {error && (
            <p className="text-sm text-red-600 font-mono font-bold">{error}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-2xl bg-cyan-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Reset password
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Back to{' '}
          <Link className="font-medium text-cyan-300 hover:text-cyan-200" to="/login">
            login
          </Link>
        </p>
      </section>
    </main>
  );
}

export default NewPasswordPage;
