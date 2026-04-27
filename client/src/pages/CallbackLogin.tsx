import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login } from "../slice/authSlice";

function CallbackLogin() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code") || "";
  const state = searchParams.get("state") || "";

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    const exchangeCodeForToken = async () => {
      if (hasRun.current) return;
      hasRun.current = true;

      try {
        const oauth_state = sessionStorage.getItem("oauth_state");
        const nonce = sessionStorage.getItem("oauth_nonce");

        if (!state || !code || state !== oauth_state) return;

        const response = await axios.post(
          `${import.meta.env.VITE_API_ENDPOINT}/customer/o/token`,
          { code, nonce },
          { withCredentials: true },
        );

        if (response.status === 200) {
          const accessToken = response.data.data.accessToken;
          const userResponse = await axios.get(
            `${import.meta.env.VITE_OIDC_ENDPOINT}/o/userinfo`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

          if (userResponse.status === 200) {
            dispatch(
              login({
                ...userResponse.data.data,
                role: "customer",
                token: accessToken,
              }),
            );
            sessionStorage.removeItem("oauth_state");
            sessionStorage.removeItem("oauth_nonce");
            navigate("/");
          }
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
      }
    };

    exchangeCodeForToken();
  }, [state, code, dispatch, navigate]);

  return <div>CallbackLogin</div>;
}

export default CallbackLogin;
