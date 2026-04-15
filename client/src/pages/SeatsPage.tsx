import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { calculateDuration, convertDate, ShowsTypes } from './HomePage';

interface SeatsTypes {
  screenId: string;
  screenName: string;
  screenType: string;
  seatId: string;
  seatName: string;
  seatPrice: number;
  seatStatus: string;
  seatType: string;
  showId: string;
  showName: string;
  showGenre: string;
};

function SeatsPage() {
  const { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate();
  const { userData: user, status } = useSelector((state: any) => state.user);
  const [show, setShow] = useState<Omit<ShowsTypes, "screenName" | "screenType">>();
  
  const location = useLocation();
  
  const [seats, setSeats] = useState<SeatsTypes[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  function calculateTotalPrice(seats: SeatsTypes[], selectedSeats: string[]): number {
    return seats
      .filter((seat) => selectedSeats.includes(seat.seatId))
      .reduce((total, seat) => total + seat.seatPrice, 0);
  };
  
  useEffect(() => {
    const fetchSeats = async () => {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/seats/${showId}`);
      setShow(response.data.data.show);
      setSeats(response.data.data.seats as SeatsTypes[]);
      setLoading(false);
    };
    fetchSeats();
  }, [showId]);
  
  const handleSeatToggle = (seatId: string, isBooked: boolean) => {
    if (isBooked) return;

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId],
    );
  };

  const handleBook = async () => {
    if (!showId || !localStorage.getItem("selectedSeats")) return;
    if (!status || !user?.token) {
      navigate('/login');
      return;
    }

    try {
      setBooking(true);
      await axios.put(
        `${import.meta.env.VITE_API_ENDPOINT}/${showId}`,
        { seatIds: JSON.parse(localStorage.getItem("selectedSeats")!) },
        {
          withCredentials: true,
          headers: { authorization: `Bearer ${user.token}` },
        },
      );
      alert('Seats booked successfully');
      setSelectedSeats([]);
      window.location.reload();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        alert(error.response.data.message);
      } else if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Booking failed. Please try again.');
      }
    } finally {
      setBooking(false);
    }
  };
  
  useEffect(() => {
    if (location.state?.paymentStatus) {
      handleBook();
      localStorage.removeItem("selectedSeats");
      location.state = null
    }
  }, [location.state?.paymentStatus]);

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

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-8 shadow-glow backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">{calculateDuration(new Date(show?.showStart!), new Date(show?.showEnd!))}</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-100">{show?.showName}</h1>
              <p className="mt-2 text-slate-400">{convertDate(show?.showStart)}</p>
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
          <div className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-8 shadow-glow flex flex-col gap-10">
            <div className="mb-6 gap-3 text-sm text-slate-300 flex justify-center">
              <div className='flex justify-center items-center text-lg font-bold gap-3'>
                <span className="inline-flex w-3 h-3 rounded-full bg-slate-700" />
                <span>Available</span>
              </div>
              
              <div className='flex justify-center items-center text-lg font-bold gap-3'>
                <span className="inline-flex w-3 h-3 rounded-full bg-cyan-500" />
                <span>Selected</span>
              </div>
              
              <div className='flex justify-center items-center text-lg font-bold gap-3'>
                <span className="inline-flex w-3 h-3 rounded-full bg-rose-500" />
                <span>Booked</span>
              </div>
            </div>

            <div className="grid gap-3 rounded-[1.75rem] bg-slate-950/80 p-6">
              <div>
                <div className="grid grid-cols-8 gap-3">
                  {seats?.map((seat, _) => {
                    const isBooked = seat.seatStatus === 'booked';
                    const isSelected = selectedSeats.includes(seat.seatId);
                    return (
                      <button
                        key={seat.seatId}
                        type="button"
                        onClick={() => handleSeatToggle(seat.seatId, isBooked)}
                        className={
                          `rounded-2xl border px-2 py-3 text-sm font-semibold transition focus:outline-none ` +
                          (isBooked
                            ? 'cursor-not-allowed bg-rose-500/90 text-slate-950 border-rose-400'
                            : isSelected
                            ? 'bg-cyan-500/90 text-slate-950 border-cyan-300'
                            : 'bg-slate-800 text-slate-100 border-slate-700 hover:bg-cyan-500/90 hover:text-slate-950')
                        }
                        disabled={isBooked || booking}
                      >
                        {seat.seatName}
                      </button>
                    );
                  })}
                </div>
              </div>
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
                <span className="font-medium text-slate-100">{show?.showName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Duration</span>
                <span className="font-medium text-slate-100">{calculateDuration(new Date(show?.showStart!), new Date(show?.showEnd!))}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Time</span>
                <span className="font-medium text-slate-100">{new Date(show?.showStart).toLocaleTimeString("en-IN", {hour: "2-digit", minute: "2-digit"})} - {new Date(show?.showEnd).toLocaleTimeString("en-IN", {hour: "2-digit", minute: "2-digit"})}</span>
              </div>
              <div className="flex items-center justify-between rounded-3xl bg-slate-900 px-4 py-4 text-slate-100">
                <span className="text-sm">Genre</span>
                <span className="text-lg font-semibold">{show?.showGenre}</span>
              </div>
            </div>

            <div className="mt-8 rounded-3xl bg-slate-950/80 p-6 text-slate-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Selected seats</span>
                  <span className="font-medium text-slate-100">{selectedSeats.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Total price</span>
                  <span className="font-medium text-slate-100">₹{calculateTotalPrice(seats!, selectedSeats)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));
                    navigate("/payment", { state: { amount: calculateTotalPrice(seats!, selectedSeats), showId: showId } });
                  }}
                  disabled={!selectedSeats.length || booking}
                  className="w-full rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
                >
                  {booking ? 'Booking...' : 'Proceed to Pay'}
                </button>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

export default SeatsPage;
