import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function VerificationPage() {
  const { token } = useParams();
  const [status, setStatus] = useState<
    'loading' | 'success' | 'failed'
  >('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    if (!token) {
      setStatus('failed');
      setMessage('Verification token is missing.');
      return;
    }

    const verify = async () => {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_ENDPOINT}/customer/verify/${token}`,
          {},
          { withCredentials: true },
        );
        setStatus('success');
        setMessage('Your email has been verified successfully. You may now log in.');
      } catch (error: unknown) {
        setStatus('failed');
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          setMessage(error.response.data.message);
        } else if (error instanceof Error) {
          setMessage(error.message);
        } else {
          setMessage('Verification failed. Please try again or request a new verification email.');
        }
      }
    };

    verify();
  }, [token]);

  const title =
    status === 'loading'
      ? 'Verifying email'
      : status === 'success'
      ? 'Email verified'
      : 'Verification failed';

  const description =
    status === 'success'
      ? 'Thanks for confirming your address. You can now sign in to your account.'
      : status === 'failed'
      ? message
      : message;

  const accentColor =
    status === 'success' ? 'text-emerald-300' : 'text-amber-300';

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-xl rounded-[2rem] border border-slate-700 bg-slate-900/95 p-8 shadow-glow backdrop-blur-xl">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Email verification</p>
          <h1 className="text-3xl font-semibold text-slate-100">{title}</h1>
          <p className={`text-sm leading-7 text-slate-400 ${accentColor}`}>{description}</p>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to={status === 'success' ? '/login' : '/'}
            className="inline-flex justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            {status === 'success' ? 'Go to login' : 'Return home'}
          </Link>

          {status === 'failed' && (
            <Link
              to="/register"
              className="inline-flex justify-center rounded-2xl border border-slate-700 bg-slate-950/80 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Register again
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}

export default VerificationPage;
