import { useLoaderData, type LoaderFunction } from "remix";
import { PageNavigationBar } from "~/components/ePub/PageNavigationBar";
import { getCurrentEpubChapter } from "~/utils/google.drive.server";

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  return getCurrentEpubChapter(id!);
};

export default function () {
  const html = useLoaderData();

  return (
    <main>
      <PageNavigationBar />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
