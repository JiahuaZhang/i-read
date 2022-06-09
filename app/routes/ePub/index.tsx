import { type drive_v3 } from "googleapis";
import { useLoaderData, type LoaderFunction } from "remix";
import FileItem from "~/components/FileItem";
import { requireUser } from "~/session.server";
import { getFilesByid, getRootChildren } from "~/utils/google.user";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUser(request);
  const children = await getRootChildren();
  return Promise.all(children.items?.map((item) => getFilesByid(item.id!))!);
};

export default function () {
  const files = useLoaderData<drive_v3.Schema$File[]>();

  return (
    <div>
      epub:
      {files.map((file) => (
        <FileItem key={file.id} file={file} />
      ))}
    </div>
  );
}
