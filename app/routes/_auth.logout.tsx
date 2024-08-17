import type { LoaderFunction } from "@remix-run/node";
import { logout } from '~/.server/session';

export const loader: LoaderFunction = async ({ request }) => {
  return logout(request);
};
