import { Hono } from "hono";
import { handle } from "hono/vercel";
import { auth } from "@/auth";
import { chatRoute } from "./routes/chat";

export type HonoType = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
};

const app = new Hono<HonoType>()
  .basePath("/api")
  .use("*", async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      c.set("user", null);
      c.set("session", null);
      return next();
    }

    c.set("user", session.user);
    c.set("session", session.session);
    return next();
  })

  .on(["POST", "GET"], "/auth/**", (c) => auth.handler(c.req.raw))

  .route("/chat", chatRoute);

export const AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
