import { type drive_v3 } from "googleapis";
import { useLoaderData, type LoaderFunction } from "remix";
import { FileLink } from "~/components/FileLink";
import { FolderLink } from "~/components/FolderLink";
import { requireUser } from "~/session.server";
import { getFilesByid, getRootChildren } from "~/utils/google.user";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUser(request);
  const children = await getRootChildren();
  return Promise.all(children.items?.map((item) => getFilesByid(item.id!))!);
};

export default function () {
  const files = useLoaderData<drive_v3.Schema$File[]>();

  const allFolder = files.filter(
    (file) => file.mimeType === "application/vnd.google-apps.folder"
  );
  const allFiles = files.filter(
    (file) => file.mimeType !== "application/vnd.google-apps.folder"
  );

  return (
    <main>
      <section>
        <h1 className="m-2 font-bold">Folder:</h1>
        <div className="mx-2 inline-grid grid-flow-col gap-x-2">
          {allFolder.map((folder) => (
            <FolderLink key={folder.id} file={folder} />
          ))}
        </div>
      </section>
      <section className="mt-4">
        <h1 className="m-2 font-bold">File:</h1>
        <div className="m-2 inline-grid grid-flow-col gap-x-2">
          {allFiles.map((file) => (
            <FileLink file={file} key={file.id} />
          ))}
        </div>
      </section>
    </main>
  );
}
