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

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div>
      <div>
        <Link
          to="/login"
          className="mx-auto block w-max rounded p-2 text-cyan-500"
        >
          login
        </Link>
        <Link
          to="/logout"
          className="mx-auto block w-max rounded p-2 text-cyan-500"
        >
          logout
        </Link>
      </div>
      <h1>Error</h1>
      <p>{error.message}</p>
      <p>The stack trace is:</p>
      <pre>{error.stack}</pre>
    </div>
  );
}
