import { useGoogleOneTapLogin } from "@react-oauth/google";
import { useLoaderData } from "@remix-run/react";
import { type LoaderFunction, useSubmit } from "remix";
import { getUser } from "~/session.server";
import Login from "./login";
export { action } from "./login";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  return user;
};

const NoUser = () => {
  const submit = useSubmit();

  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      const { credential = "" } = credentialResponse;
      submit({ credential }, { method: "post" });
    },
    onError: () => {
      console.error("Fail to login");
    },
  });

  return <Login />;
};

export default function Index() {
  const user = useLoaderData();

  if (!user) return <NoUser />;

  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      main page
    </main>
  );
}
