import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

interface ScreenType {
  screenId: string;
  screenName: string;
  screenType: string;
}

interface ShowFormData {
  name: string;
  genre: string;
  start: string;
  end: string;
  screenId: string;
}

const showGenres = [
  { value: "Action", label: "Action" },
  { value: "Drama", label: "Drama" },
  { value: "Comedy", label: "Comedy" },
  { value: "Sci-Fi", label: "Sci-Fi" },
  { value: "Romance", label: "Romance" },
  { value: "Fantasy", label: "Fantasy" },
];

function AddShows({ screens }: { screens: ScreenType[] }) {
  const [submittingShow, setSubmittingShow] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm<ShowFormData>();

  const { userData: user } = useSelector((state: any) => state.user);

  const handleAddShow = async (data: ShowFormData) => {
    setSubmittingShow(true);
    setStatusMessage(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/show/register`,
        data,
        {
          headers: { Authorization: `Bearer ${user.token}` },
          withCredentials: true,
        },
      );
      setStatusMessage("Show created successfully.");
      reset();

    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setStatusMessage(error.response?.data.message);
        alert(error.response?.data.message);
        console.log(error.response?.data.message);
      } else {
        setStatusMessage("Unable to create show.");
      }
    } finally {
      setSubmittingShow(false);
    }
  };

  return (
    <section className="rounded-[2rem] border border-slate-700 bg-slate-900/95 p-8 shadow-glow backdrop-blur-xl">
      <h2 className="text-2xl font-semibold text-slate-100">Add show</h2>
      <p className="mt-2 text-slate-400">
        Schedule a show and attach it to one of the registered screens.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit(handleAddShow)}>
        <label className="block">
          <span className="text-md font-bold text-slate-300">Show name</span>
          <input
            required
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            placeholder="Enter show name"
            {...register("name", { required: true })}
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-md font-bold text-slate-300">Start time</span>
            <input
              type="datetime-local"
              min={new Date().toISOString().slice(0, 16)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              {...register("start", { required: true })}
            />
          </label>

          <label className="block">
            <span className="text-md font-bold text-slate-300">End time</span>
            <input
              type="datetime-local"
              min={new Date().toISOString().slice(0, 16)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              {...register("end", { required: true })}
            />
          </label>
        </div>

        <label className="block">
          <span className="text-md font-bold text-slate-300">Screen</span>
          <select
            {...register("screenId", { required: true })}
            required
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            
          >
            {screens.length > 0 ? (
              screens.map((screen) => (
                <option
                  key={screen.screenId}
                  value={screen.screenId}
                  className="bg-slate-950 text-slate-100"
                >
                  {screen.screenName} — {screen.screenType}
                </option>
              ))
            ) : (
              <option value="" disabled>
                Add a screen first
              </option>
            )}
          </select>
        </label>

        <label className="block">
          <span className="text-md font-bold text-slate-300">Show genre</span>

          <select
            {...register("genre", { required: true })}
            required
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
          >
            {showGenres.length > 0 &&
              showGenres.map((genre) => (
                <option
                  key={genre.value}
                  value={genre.value}
                  className="bg-slate-950 text-slate-100"
                >
                  {genre.label}
                </option>
              ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={submittingShow || screens.length === 0}
          className="w-full rounded-2xl bg-cyan-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700"
        >
          {submittingShow ? "Creating show..." : "Add show"}
        </button>
      </form>
    </section>
  );
}

export default AddShows;
