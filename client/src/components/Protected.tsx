import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


function Protected({ children }: { children: React.ReactNode }) {
  const { status, userData: user } = useSelector((state: any) => state.user);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!status || !user || user.role !== "admin") {
      navigate("/");
    }
  }, [status, user, navigate]);

  return <>{children}</>;
}

export default Protected;
