import { Link, useNavigate } from "react-router-dom";
import { ScreenType } from "../pages/AdminPanelPage";

function ExistingScreens({ screens, loadingScreens }: { screens: ScreenType[]; loadingScreens: boolean }) {
  
  const navigate = useNavigate();
  
  return (
    <section className="rounded-[2rem] border border-slate-700 bg-slate-900/95 p-8 shadow-glow backdrop-blur-xl">
      <div className="gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="mt-8 rounded-3xl bg-slate-950/80 p-6 text-slate-300">
          <h3 className="text-sm uppercase tracking-[0.3em] text-cyan-300">
            Existing screens
          </h3>
          <div className="mt-4 space-y-3 grid grid-cols-4 gap-3">
            {loadingScreens ? (
              <div className="text-slate-400">Loading screens...</div>
            ) : screens.length > 0 ? (
              screens.map((screen) => (
                <div
                  key={screen.screenId}
                  onClick={() => navigate(`/admin/screens/${screen.screenId}/shows`, { state: { screen } })}
                  className="rounded-3xl bg-slate-900 mt-4 p-4 hover:bg-slate-800 hover:-translate-y-1 cursor-pointer transition-all"
                >
                  <p className="font-medium text-slate-100">
                    {screen.screenName}
                  </p>
                  <p className="text-sm text-slate-400">
                    {screen.screenType}
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.25em] text-cyan-300">
                    View shows
                  </p>
                </div>
              ))
            ) : (
              <div className="text-slate-400">
                No screens registered yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}


export default ExistingScreens;
