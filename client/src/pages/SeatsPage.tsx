import { Link, useParams } from 'react-router-dom';
import type { Show } from '../App';

interface SeatsPageProps {
  shows: Show[];
}

const seatRows = 5;
const seatColumns = 8;

function SeatsPage({ shows }: SeatsPageProps) {
  const { id } = useParams<{ id: string }>();
  const show = shows.find((item) => item.id === id);

  if (!show) {
    return (
      <main className="min-h-screen px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-700 bg-slate-900/90 p-8 text-center shadow-glow backdrop-blur-xl">
          <p className="text-slate-400">Show not found.</p>
          <Link className="mt-6 inline-flex rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950" to="/">
            Back to shows
          </Link>
        </div>
      </main>
    );
  }

  const bookedSeats = new Set(['A2', 'A3', 'B5', 'C1', 'D7', 'E4']);

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-8 shadow-glow backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">{show.venue}</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-100">{show.title}</h1>
              <p className="mt-2 text-slate-400">{show.time}</p>
            </div>
            <Link
              to="/"
              className="rounded-2xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-700"
            >
              Back to shows
            </Link>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-8 shadow-glow">
            <div className="mb-6 grid grid-cols-[auto_1fr] gap-3 text-sm text-slate-300">
              <span className="inline-flex h-3 w-3 rounded-full bg-slate-700" />
              <span>Available</span>
              <span className="inline-flex h-3 w-3 rounded-full bg-cyan-500" />
              <span>Selected</span>
              <span className="inline-flex h-3 w-3 rounded-full bg-rose-500" />
              <span>Booked</span>
            </div>

            <div className="grid gap-3 rounded-[1.75rem] bg-slate-950/80 p-6">
              {Array.from({ length: seatRows }).map((_, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-8 gap-3">
                  {Array.from({ length: seatColumns }).map((__, colIndex) => {
                    const seatCode = `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`;
                    const isBooked = bookedSeats.has(seatCode);
                    return (
                      <button
                        key={seatCode}
                        type="button"
                        className={
                          `rounded-2xl border px-2 py-3 text-sm font-semibold transition focus:outline-none ` +
                          (isBooked
                            ? 'cursor-not-allowed bg-rose-500/90 text-slate-950 border-rose-400'
                            : 'bg-slate-800 text-slate-100 border-slate-700 hover:bg-cyan-500/90 hover:text-slate-950')
                        }
                        disabled={isBooked}
                      >
                        {seatCode}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-8 shadow-glow">
            <h2 className="text-2xl font-semibold text-slate-100">Seat details</h2>
            <p className="mt-3 text-slate-400">
              Choose your seat from the layout. Reserved seats are unavailable, but plenty of premium spots remain.
            </p>
            <div className="mt-8 space-y-4 rounded-3xl bg-slate-950/80 p-6 text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Show</span>
                <span className="font-medium text-slate-100">{show.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Venue</span>
                <span className="font-medium text-slate-100">{show.venue}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Time</span>
                <span className="font-medium text-slate-100">{show.time}</span>
              </div>
              <div className="flex items-center justify-between rounded-3xl bg-slate-900 px-4 py-4 text-slate-100">
                <span className="text-sm">Remaining seats</span>
                <span className="text-lg font-semibold">{show.availableSeats}</span>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

export default SeatsPage;
