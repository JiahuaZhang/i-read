import { useRecoilValue } from "recoil";
import { useLoaderData, type LoaderFunction } from "remix";
import { PageNavigationBar } from "~/components/ePub/PageNavigationBar";
import { getCurrentEpubChapter } from "~/utils/google.drive.server";
import { bookConfigState } from "~/utils/state/book.config";

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  return getCurrentEpubChapter(id!);
};

export default function () {
  const html = useLoaderData();
  const { fontSize } = useRecoilValue(bookConfigState);

  return (
    <main>
      <PageNavigationBar />
      <div dangerouslySetInnerHTML={{ __html: html }} style={{ fontSize }} />
    </main>
  );
}
