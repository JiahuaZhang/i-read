import { LoaderFunction } from '@remix-run/node';
import { Link, MetaFunction, redirect, useLoaderData } from '@remix-run/react';
import { Breadcrumb } from 'antd';
import { drive_v3 } from 'googleapis';
import { getAllParents, getFolderFiles } from '~/.server/google/drive';
import { requireUser } from '~/.server/session';
import { FileLink } from '~/component/FileLink';
import { FolderLink } from '~/component/FolderLink';
import { isGoogleFolder } from './drive_';

export const meta: MetaFunction = ({ params: { id = '' } }) => [{ title: `Folder ${id}` }];

export const loader: LoaderFunction = async ({ request, params }) => {
  const { id } = params;

  if (!id) {
    return redirect("/drive");
  }

  const user = await requireUser(request);
  const parents = await getAllParents(user, id);
  const kids = await getFolderFiles(user, id);

  return { parents, kids };
};

export default function () {
  const { parents, kids } = useLoaderData<{
    parents: { name: string; id: string; }[];
    kids: drive_v3.Schema$FileList;
  }>();
  const allFolder = kids.files?.filter(isGoogleFolder) || [];
  const allFiles = kids.files?.filter((file) => !isGoogleFolder(file)) || [];
  const items = parents.map(parent => ({
    title: <Link to={`/drive/folder/${parent.id}`}>{parent.name}</Link>
  }));

  return (
    <main className="text-lg">
      <header>
        <Breadcrumb className="text-base" items={items} />
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
