import { useRouteError } from '@remix-run/react';
import { Link } from 'react-router-dom';

export const ErrorBoundary = () => {
  const error = useRouteError() as Error;

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
};
