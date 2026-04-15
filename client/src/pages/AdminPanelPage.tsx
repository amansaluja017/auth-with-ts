import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slice/authSlice";
import AddShows from "../components/AddShows";
import { useForm } from "react-hook-form";
import ExistingScreens from "../components/ExistingScreens";

export interface ScreenType {
  screenId: string;
  screenName: string;
  screenType: string;
}

const screenTypes = ["IMAX", "Dolby Atmos", "VIP Lounge", "3D", "Standard"];

function AdminPanelPage() {
  const [selectedScreen, setSelectedScreen] = useState("");
  const [screens, setScreens] = useState<ScreenType[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loadingScreens, setLoadingScreens] = useState(false);
  const [submittingScreen, setSubmittingScreen] = useState(false);

  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<Omit<ScreenType, "screenId">>();

  const { userData: user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
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

  const handleAddScreen = async (data: Omit<ScreenType, "screenId">) => {
    setSubmittingScreen(true);
    setStatusMessage(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/screen/register`,
        { name: data.screenName, type: data.screenType },
        {
          headers: { Authorization: `Bearer ${user.token}` },
          withCredentials: true,
        },
      );

      setStatusMessage("Screen added successfully.");
      if (response.data?.data) {
        setScreens((prev) => [...prev, response.data.data]);
        setSelectedScreen(response.data.data.screenId || "");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setStatusMessage(error.response?.data.message);
      } else {
        setStatusMessage("Unable to add screen.");
      }
    } finally {
      setSubmittingScreen(false);
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
                className="rounded-2xl bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-700"
              >
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

            <form
              className="mt-8 space-y-5"
              onSubmit={handleSubmit(handleAddScreen)}
            >
              <label className="block">
                <span className="text-md font-bold text-slate-300">Screen name</span>
                <input
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="Enter screen name"
                  {...register("screenName")}
                />
              </label>

              <label className="block">
                <span className="text-md font-bold text-slate-300">Screen type</span>
                <select
                  {...register("screenType", { required: true })}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                >
                  {screenTypes.map((type) => (
                    <option
                      key={type}
                      value={type}
                      className="bg-slate-950 text-slate-100"
                    >
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="submit"
                disabled={submittingScreen}
                className="w-full rounded-2xl bg-cyan-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700"
              >
                {submittingScreen ? "Adding screen..." : "Add screen"}
              </button>
            </form>
            
          </section>

          <AddShows screens={screens} />
        </div>

        <ExistingScreens screens={screens} loadingScreens={loadingScreens} />
      </div>
    </main>
  );
}

export default AdminPanelPage;
