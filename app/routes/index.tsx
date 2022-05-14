import { useGoogleOneTapLogin } from "@react-oauth/google";
import { Link, useLoaderData, useMatches } from "@remix-run/react";
import { type LoaderFunction } from "remix";
import { getUser } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = getUser(request);
  // return {};
  return user;
};

export default function Index() {
  const user = useLoaderData();
  console.log({ user });
  // useGoogleOneTapLogin({
  //   onSuccess: (credentialResponse) => {
  //     console.log(credentialResponse);
  //   },
  //   onError: () => {
  //     console.log("fail to login");
  //   },
  // });

  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      main page
    </main>
  );
}
