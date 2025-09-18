import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { API_AUTH_URL } from "./constants";

export const authClient = createAuthClient({
  baseURL: API_AUTH_URL,
  fetchOptions: {
    auth: {
      type: "Bearer",
      token: () => localStorage.getItem("bearer_token") || "",
    },
    onSuccess: (ctx) => {
      const authToken = ctx.response.headers.get("set-auth-token");
      if (authToken) {
        localStorage.setItem("bearer_token", authToken);        
      }
    },
  },
  plugins: [
    inferAdditionalFields({
      user: {
        institutionId: {
          type: "number",
          required: false,
        },
        areasOfInterest: {
          type: "string", // We'll store as JSON string for now
          required: false,
        },
      },
    }),
  ],
});
