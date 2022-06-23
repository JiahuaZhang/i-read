import { type LoaderFunction, Outlet } from "remix";
import { getEPub } from "~/utils/google.drive.server";

export const loader: LoaderFunction = async ({ params }) => {
  const { fileId = "" } = params;
  return getEPub(fileId);
};

export default function () {
  return <Outlet />;
}
