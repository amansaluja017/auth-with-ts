import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProfilePage() {
  const { userData: user } = useSelector((state: any) => state.user);
  console.log(user)
  
  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="rounded-[2rem] border border-slate-700 bg-slate-900/95 p-8 shadow-glow backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Profile</p>
              <h1 className="mt-2 text-4xl font-semibold text-slate-100">Your account details</h1>
              <p className="mt-3 max-w-2xl text-slate-400">
                Manage your booking profile, review membership perks, and see your next selected screening.
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center rounded-2xl bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-700"
            >
              Back to home
            </Link>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_0.95fr]">
          <section className="rounded-[2rem] border border-slate-700 bg-slate-900/95 p-8 shadow-glow backdrop-blur-xl">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-500 text-3xl font-bold text-slate-950">
                {user.firstName[0].toUpperCase()}{user.lastName[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Hello,</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-100">{user.firstName} {user.lastName}</h2>
                <p className="mt-2 text-slate-400">{user.email}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              <div className="rounded-3xl bg-slate-950/80 p-5 text-slate-300">
                <p className="text-sm text-slate-500">Email</p>
                <p className="mt-2 text-lg font-medium text-slate-100">{user.email}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 p-5 text-slate-300">
                <p className="text-sm text-slate-500">Location</p>
                <p className="mt-2 text-lg font-medium text-slate-100">location</p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 p-5 text-slate-300">
                <p className="text-sm text-slate-500">Member since</p>
                <p className="mt-2 text-lg font-medium text-slate-100">not a member</p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-700 bg-slate-900/95 p-8 shadow-glow backdrop-blur-xl">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-100">Upcoming booking</h2>
                <p className="mt-3 text-slate-400">Next show on your itinerary.</p>
              </div>

              <div className="rounded-[1.75rem] bg-slate-950/80 p-6 text-slate-200">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Featured screening</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-100">"</h3>
                  </div>
                  <span className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950">
                    Reserved
                  </span>
                </div>
                <p className="mt-4 text-slate-400">Enjoy premium access and early seating alerts for your next show.</p>
              </div>

              <div className="rounded-[1.75rem] bg-slate-950/80 p-6 text-slate-200">
                <h3 className="text-lg font-semibold text-slate-100">Membership perks</h3>
                <ul className="mt-4 space-y-3 text-slate-400">
                  <li className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                    Priority seat selection
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                    Personalized show recommendations
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                    Exclusive member pricing
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default ProfilePage;
