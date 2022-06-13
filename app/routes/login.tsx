import { type LoaderFunction } from "remix";
import { googleUserLogin } from "~/session.server";
import { getGoogleAuthUrl, getGoogleUser } from "~/utils/google.user";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return getGoogleAuthUrl();
  }

  const user = await getGoogleUser(code);
  return googleUserLogin({ request, user });
};
