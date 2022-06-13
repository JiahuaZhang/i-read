import { useLoaderData } from "@remix-run/react";
import { type LoaderFunction, Link } from "remix";
import { getUser } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = (await getUser(request)) || null;
  return user;
};

export default function Index() {
  const user = useLoaderData();

  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      {user && <Link to="drive">Drive</Link>}
      {!user && <Link to="login">Login</Link>}
    </main>
  );
}
