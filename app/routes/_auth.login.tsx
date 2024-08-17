import { type LoaderFunction } from "@remix-run/node";
import { googleUserLogin } from '~/.server/session';
import { getGoogleAuthUrl, getGoogleUser } from '~/util/user/google.user';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return getGoogleAuthUrl();
  }

  const user = await getGoogleUser(code);
  return googleUserLogin({ request, user });
};