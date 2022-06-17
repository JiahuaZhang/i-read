import { Breadcrumb } from "antd";
import { type drive_v3 } from "googleapis";
import { Link, redirect, useLoaderData, type LoaderFunction } from "remix";
import { FileLink } from "~/components/FileLink";
import { FolderLink } from "~/components/FolderLink";
import { getAllParents, getFolderFiles } from "~/utils/google.drive.server";
import { isGoogleFolder } from "..";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { id } = params;

  if (!id) {
    return redirect("/drive");
  }

  const parents = await getAllParents(id);
  const kids = await getFolderFiles(id);

  return { parents, kids };
};

export default function () {
  const { parents, kids } = useLoaderData<{
    parents: { name: string; id: string }[];
    kids: drive_v3.Schema$FileList;
  }>();
  const allFolder = kids.files?.filter(isGoogleFolder) || [];
  const allFiles = kids.files?.filter((file) => !isGoogleFolder(file)) || [];

  return (
    <main>
      <header>
        <Breadcrumb>
          {parents.map((parent) => (
            <Breadcrumb.Item key={parent.id} className="inline-block">
              <Link to={`/drive/folder/${parent.id}`}>{parent.name}</Link>
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      </header>
      <section>
        <h1 className="m-2 font-bold">Folder:</h1>
        <div
          className="mx-2 grid auto-cols-max gap-2"
          style={{ gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))" }}
        >
          {allFolder.map((folder) => (
            <FolderLink key={folder.id} file={folder} />
          ))}
        </div>
      </section>
      <section className="mt-4">
        <h1 className="m-2 font-bold">File:</h1>
        <div
          style={{ gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))" }}
          className="mx-2 grid auto-cols-max gap-2"
        >
          {allFiles.map((file) => (
            <FileLink file={file} key={file.id} />
          ))}
        </div>
      </section>
    </main>
  );
}
