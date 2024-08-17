import { type LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getUser } from '~/.server/session';

export const loader: LoaderFunction = async ({ request }) => {
  const user = (await getUser(request)) || null;
  return user;
};

export default function Index() {
  const user = useLoaderData<typeof loader>();

  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <button un-border='2 blue-6 solid rounded' un-p='2'>
        {user && <Link to="drive">Drive</Link>}
        {!user && <Link to="login">Login</Link>}
      </button>
    </main>
  );
}