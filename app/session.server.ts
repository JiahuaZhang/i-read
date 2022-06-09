import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { type GoogleUser } from './utils/google.user';

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

export async function getUser(request: Request): Promise<GoogleUser | undefined> {
  const session = await getSession(request);
  return session.get(USER_SESSION_KEY);
}

export async function requireUser(request: Request) {
  const user = await getUser(request);

  if (!user) {
    const redirectTo = new URL(request.url).pathname;
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }

  return user;
}

export async function createUserSession({
  request,
  user,
  remember = true,
  redirectTo = '/',
}: {
  request: Request;
  user: GoogleUser;
  remember: boolean;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, user);
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

// export const login = async ({
//   request, jwt, remember = true, redirectTo = '/'
// }: {
//   request: Request; jwt: string;
//   remember?: boolean; redirectTo?: string;
// }) => {
//   const session = await getSession(request);
//   session.set(USER_SESSION_KEY, jwt);
//   return redirect(redirectTo, {
//     headers: {
//       "Set-Cookie": await sessionStorage.commitSession(session, {
//         maxAge: remember
//           ? 60 * 60 * 24 * 7 // 7 days
//           : undefined,
//       }),
//     },
//   });
// };

export const googleUserLogin = async ({
  request, user, remember = true, redirectTo = '/'
}: {
  request: Request; user: GoogleUser;
  remember?: boolean; redirectTo?: string;
}) => {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, user);
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