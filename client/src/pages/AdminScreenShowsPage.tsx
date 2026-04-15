import { useEffect, useState } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { calculateDuration, convertDate } from "./HomePage";

interface ScreenType {
  screenId: string;
  screenName: string;
  screenType: string;
}

interface ShowType {
  screenId: string;
  screenName: string;
  screenType: string;
  showDuration: string;
  showId: string;
  showStart: string;
  showEnd: string;
  showName: string;
  showGenre: string;
}

function AdminScreenShowsPage() {
  const { screenId } = useParams<{ screenId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData: user } = useSelector((state: any) => state.user);
  
  const location = useLocation();
  const screen = location.state?.screen as ScreenType | undefined;

  const [shows, setShows] = useState<ShowType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadScreenShows() {
      if (!screenId) {
        setError("No screen selected.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const screenResponse = await axios.get(
          `${import.meta.env.VITE_API_ENDPOINT}/admin/show/${screenId}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
            withCredentials: true,
          },
        );

        const fetchedShows: ShowType[] = screenResponse.data?.data || [];
        setShows(fetchedShows);
      } catch (loadError) {
        if (loadError instanceof AxiosError) {
          setError(loadError.response?.data.message);
        }
        else {
          setError("Failed to load shows for this screen.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadScreenShows();
  }, [screenId, user]);


  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-[2rem] border border-slate-700 bg-slate-900/95 p-8 shadow-glow backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
                Admin screen shows
              </p>
              <h1 className="mt-2 text-4xl font-semibold text-slate-100">
                Shows for {screen?.screenName ?? "selected screen"}
              </h1>
              <p className="mt-3 text-slate-400">
                Review all scheduled shows tied to this screen, including start
                time, duration, and genre.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/admin/dashboard"
                className="rounded-2xl border border-slate-700 bg-slate-950/90 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-500 hover:text-cyan-300"
              >
                Back to dashboard
              </Link>
            </div>
          </div>
        </header>

        {error && (
          <div className="rounded-[1.75rem] border border-rose-500/40 bg-rose-500/10 p-5 text-slate-100">
            {error}
          </div>
        )}

        <section className="rounded-[2rem] border border-slate-700 bg-slate-900/95 p-8 shadow-glow backdrop-blur-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">
                Screen details
              </p>
                <div className="mt-4 space-y-2">
                  <p className="text-xl font-semibold text-slate-100">
                    {screen?.screenName}
                  </p>
                  <p className="text-sm text-slate-400">{screen?.screenType}</p>
                  <p className="text-sm text-slate-400">
                    {shows.length} show{shows.length === 1 ? "" : "s"} scheduled
                  </p>
                </div>
              
            </div>
          </div>
        </section>

        <section className="grid gap-5">
          {loading ? (
            <div className="rounded-[2rem] border border-slate-700 bg-slate-900/95 p-8 text-slate-400 shadow-glow backdrop-blur-xl">
              Loading shows...
            </div>
          ) : shows.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {shows.map((show) => (
                <article
                  key={show.showId}
                  className="group rounded-[1.75rem] border border-slate-700 bg-slate-950/90 p-6 transition hover:-translate-y-1 hover:border-cyan-500/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                        {show.showGenre}
                      </p>
                      <h3 className="mt-3 text-2xl font-semibold text-slate-100">
                        {show.showName}
                      </h3>
                    </div>
                    <div className="rounded-3xl bg-slate-900 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">
                      {convertDate(show.showStart)}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                    <span className="rounded-2xl bg-slate-900 px-3 py-2">
                      {calculateDuration(new Date(show.showStart), new Date(show.showEnd))}
                    </span>
                    <span className="rounded-2xl bg-slate-900 px-3 py-2">
                      {show.screenName}
                    </span>
                  </div>

                  {/*<div className="mt-6 flex justify-end">
                    <Link
                      to={`/shows/${show.showId}`}
                      className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                    >
                      View show details
                    </Link>
                  </div>*/}
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-slate-700 bg-slate-900/95 p-8 text-slate-400 shadow-glow backdrop-blur-xl">
              No shows are scheduled for this screen yet.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminScreenShowsPage;
