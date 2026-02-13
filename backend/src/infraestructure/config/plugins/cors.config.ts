import cors from "cors";

const whiteListCors: (string | RegExp)[] = [
  /^(http:\/\/)?localhost:[0-9]{1,5}$/,
  "https://stores-project-frontend.vercel.app",
];

export const corsAppConfig: cors.CorsOptions = {
  credentials: true,
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (!origin) {
      callback(null, true);
    } else {
      const isAllowed = whiteListCors.some((pattern) => {
        if (typeof pattern === "string") {
          return origin === pattern;
        }
        return pattern.test(origin);
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  },
};
