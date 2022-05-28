import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { getUserFromJwt } from './utils/google.user';

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

const USER_SESSION_KEY = "userId";

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getJwt(request: Request): Promise<string | undefined> {
  const session = await getSession(request);
  const jwt = session.get(USER_SESSION_KEY);
  return jwt;
}

export async function getUser(request: Request) {
  const userId = await getJwt(request);
  if (!userId) return null;

  return getUserFromJwt(userId);
}

export async function requireJwt(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const jwt = await getJwt(request);
  if (!jwt) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return jwt;
}

export async function requireUser(request: Request) {
  const jwt = await requireJwt(request);

  return getUserFromJwt(jwt);
}

export async function createUserSession({
  request,
  jwt,
  remember,
  redirectTo,
}: {
  request: Request;
  jwt: string;
  remember: boolean;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, jwt);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

export const login = async ({
  request, jwt, remember = true, redirectTo = '/'
}: {
  request: Request; jwt: string;
  remember?: boolean; redirectTo?: string;
}) => {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, jwt);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
};

export async function logout(request: Request) {
  const session = await getSession(request);

  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}