import cors from "@elysia/cors";
import { Elysia } from "elysia";
import { authGuard } from "./plugins/auth-guard";
import { openApiPlugin } from "./plugins/openapi";

const PORT = Number(process.env.PORT) ?? 4000;

const corsConfig = {
  origin: String(process.env.FRONTEND_URL),
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

const app = new Elysia()
  .use(cors(corsConfig))
  .use(authGuard)
  .use(openApiPlugin)
  .listen(PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
