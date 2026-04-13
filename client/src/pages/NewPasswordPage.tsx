import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';

function NewPasswordPage() {
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
      if (error instanceof Error) {
        alert(error.message);
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
          <label className="block">
            <span className="text-sm text-slate-300">New password</span>
            <input
              type="password"
              required
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              placeholder="Enter new password"
              {...register('newPassword', { required: true })}
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-300">Confirm password</span>
            <input
              type="password"
              required
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              placeholder="Confirm new password"
              {...register('confirmPassword', { required: true })}
            />
          </label>

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
