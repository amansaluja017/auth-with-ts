import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slice/authSlice";

interface ScreenType {
  screenId: string;
  screenName: string;
  screenType: string;
}

const screenTypes = ["IMAX", "Dolby Atmos", "VIP Lounge", "3D", "Standard"];

function AdminPanelPage() {
  const navigate = useNavigate();

  const [screenName, setScreenName] = useState("");
  const [screenType, setScreenType] = useState(screenTypes[0]);
  const [showName, setShowName] = useState("");
  const [showGenre, setShowGenre] = useState("");
  const [showStart, setShowStart] = useState("");
  const [showEnd, setShowEnd] = useState("");
  const [selectedScreen, setSelectedScreen] = useState("");
  const [screens, setScreens] = useState<ScreenType[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loadingScreens, setLoadingScreens] = useState(false);
  const [submittingScreen, setSubmittingScreen] = useState(false);
  const [submittingShow, setSubmittingShow] = useState(false);

  const { userData: user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate("/admin/login");
      return;
    }

    const loadScreens = async () => {
      setLoadingScreens(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_ENDPOINT}/screen`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
            withCredentials: true,
          },
        );
        const fetchedScreens = response.data?.data || [];
        if (fetchedScreens.length > 0) {
          setScreens(fetchedScreens);
          setSelectedScreen(fetchedScreens[0].screenId);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingScreens(false);
      }
    };

    loadScreens();
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/admin/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${user?.token}` },
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        dispatch(logout());
        navigate("/admin/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleAddScreen = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setSubmittingScreen(true);
    setStatusMessage(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/screen/register`,
        { name: screenName, type: screenType },
        {
          headers: { Authorization: `Bearer ${user.token}` },
          withCredentials: true,
        },
      );
     
      setStatusMessage("Screen added successfully.");
      setScreenName("");
      setScreenType(screenTypes[0]);
      if (response.data?.data) {
        setScreens((prev) => [...prev, response.data.data]);
        setSelectedScreen(response.data.data.screenId || "");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unable to add screen.";
      setStatusMessage(message);
    } finally {
      setSubmittingScreen(false);
    }
  };

  const handleAddShow = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setSubmittingShow(true);
    setStatusMessage(null);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/show/register`,
        {
          name: showName,
          genre: showGenre,
          start: showStart,
          end: showEnd,
          screenId: selectedScreen,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
          withCredentials: true,
        },
      );
      setStatusMessage("Show created successfully.");
      setShowName("");
      setShowGenre("");
      setShowStart("");
      setShowEnd("");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unable to create show.";
      setStatusMessage(message);
    } finally {
      setSubmittingShow(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-[2rem] border border-slate-700 bg-slate-900/95 p-8 shadow-glow backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
                Admin panel
              </p>
              <h1 className="mt-2 text-4xl font-semibold text-slate-100">
                Manage screens and shows
              </h1>
              <p className="mt-3 text-slate-400">
                Add new screens and schedule shows for the theater. Admin access
                is required.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-2xl bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-700">
                Admin logout
              </button>
            </div>
          </div>
        </header>

        {statusMessage && (
          <div className="rounded-[1.75rem] border border-cyan-500/40 bg-cyan-500/10 p-5 text-slate-100">
            {statusMessage}
          </div>
        )}

        <div className="grid gap-8 xl:grid-cols-[1fr_1.1fr]">
          <section className="rounded-[2rem] border border-slate-700 bg-slate-900/95 p-8 shadow-glow backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-slate-100">
              Add screen
            </h2>
            <p className="mt-2 text-slate-400">
              Register a new screen for the theater and choose the experience
              style.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleAddScreen}>
              <label className="block">
                <span className="text-sm text-slate-300">Screen name</span>
                <input
                  value={screenName}
                  onChange={(event) => setScreenName(event.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="Enter screen name"
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-300">Screen type</span>
                <select
                  value={screenType}
                  onChange={(event) => setScreenType(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20">
                  {screenTypes.map((type) => (
                    <option
                      key={type}
                      value={type}
                      className="bg-slate-950 text-slate-100">
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="submit"
                disabled={submittingScreen}
                className="w-full rounded-2xl bg-cyan-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700">
                {submittingScreen ? "Adding screen..." : "Add screen"}
              </button>
            </form>

            <div className="mt-8 rounded-3xl bg-slate-950/80 p-6 text-slate-300">
              <h3 className="text-sm uppercase tracking-[0.3em] text-cyan-300">
                Existing screens
              </h3>
              <div className="mt-4 space-y-3">
                {loadingScreens ?
                  <div className="text-slate-400">Loading screens...</div>
                : screens.length > 0 ?
                  screens.map((screen) => (
                    <div
                      key={screen.screenId}
                      className="rounded-3xl bg-slate-900 p-4">
                      <p className="font-medium text-slate-100">
                        {screen.screenName}
                      </p>
                      <p className="text-sm text-slate-400">
                        {screen.screenType}
                      </p>
                    </div>
                  ))
                : <div className="text-slate-400">
                    No screens registered yet.
                  </div>
                }
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-700 bg-slate-900/95 p-8 shadow-glow backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-slate-100">Add show</h2>
            <p className="mt-2 text-slate-400">
              Schedule a show and attach it to one of the registered screens.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleAddShow}>
              <label className="block">
                <span className="text-sm text-slate-300">Show name</span>
                <input
                  value={showName}
                  onChange={(event) => setShowName(event.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="Enter show name"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm text-slate-300">Start time</span>
                  <input
                    type="datetime-local"
                    value={showStart}
                    onChange={(event) => setShowStart(event.target.value)}
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-slate-300">End time</span>
                  <input
                    type="datetime-local"
                    value={showEnd}
                    onChange={(event) => setShowEnd(event.target.value)}
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm text-slate-300">Screen</span>
                <select
                  value={selectedScreen}
                  onChange={(event) => setSelectedScreen(event.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20">
                  {screens.length > 0 ?
                    screens.map((screen) => (
                      <option
                        key={screen.screenId}
                        value={screen.screenId}
                        className="bg-slate-950 text-slate-100">
                        {screen.screenName} — {screen.screenType}
                      </option>
                    ))
                  : <option value="" disabled>
                      Add a screen first
                    </option>
                  }
                </select>
              </label>

              <label className="block">
                <span className="text-sm text-slate-300">Show genre</span>
                <input
                  value={showGenre}
                  onChange={(event) => setShowGenre(event.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="Enter show genre"
                />
              </label>

              <button
                type="submit"
                disabled={submittingShow || screens.length === 0}
                className="w-full rounded-2xl bg-cyan-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700">
                {submittingShow ? "Creating show..." : "Add show"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

export default AdminPanelPage;
