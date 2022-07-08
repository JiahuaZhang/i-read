import { redirect, type LoaderFunction } from "remix";
import { getEPub } from "~/utils/google.drive.server";

export const loader: LoaderFunction = async ({ params }) => {
  console.log(params);
  const { fileId } = params;
  const book = await getEPub(fileId!);
  return redirect(`/ePub/${fileId}/${book.flow[0].id}`);
};