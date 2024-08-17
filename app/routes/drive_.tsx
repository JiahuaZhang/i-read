import { LoaderFunction } from '@remix-run/node';
import { MetaFunction, useLoaderData } from '@remix-run/react';
import { type drive_v3 } from 'googleapis';
import { getFolderFiles } from '~/.server/google/drive';
import { requireUser } from '~/.server/session';
import { ErrorBoundary } from '~/component/common/ErrorBoundary';
import { FileLink } from '~/component/FileLink';
import { FolderLink } from '~/component/FolderLink';

export { ErrorBoundary };

export const GOOGLE_FOLDER_TYPE = "application/vnd.google-apps.folder";
export const isGoogleFolder = (file: drive_v3.Schema$File) =>
  file.mimeType === GOOGLE_FOLDER_TYPE;

export const meta: MetaFunction = () => [{ title: "Drive" }];

export const loader: LoaderFunction = async ({ request }) => {
  await requireUser(request);
  return getFolderFiles("root");
};

export default function () {
  const fileList = useLoaderData<drive_v3.Schema$FileList>();

  const allFolder = fileList.files?.filter(isGoogleFolder) || [];
  const allFiles =
    fileList.files?.filter((file) => !isGoogleFolder(file)) || [];

  return (
    <main className="text-lg" >
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
