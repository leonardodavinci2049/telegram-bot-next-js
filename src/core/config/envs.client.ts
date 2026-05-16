import { z } from "zod";

import { parseEnv } from "@/core/config/env-validation";

const publicEnvsSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export const publicEnvs = parseEnv(
  publicEnvsSchema,
  {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  {
    scope: "client",
    sourceFiles: [".env"],
  },
);

export type PublicEnvs = z.infer<typeof publicEnvsSchema>;
