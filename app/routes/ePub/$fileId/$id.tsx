import type EPub from "epub";
import { useMemo } from "react";
import { Link, useLoaderData, useParams, type LoaderFunction } from "remix";
import { useMatchesData } from "~/utils";
import { getCurrentEpubChapter } from "~/utils/google.drive.server";

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  return getCurrentEpubChapter(id!);
};

const getAdjacentFlow = (id: string, flows: EPub.TocElement[]) => {
  const index = flows.findIndex((flow) => flow.id === id);
  const hasFront = index > 0;
  const hasNext = index < flows.length;
  return [
    hasFront ? flows[index - 1].id : null,
    hasNext ? flows[index + 1].id : null,
  ];
};

const renderPageNavigation = (fileId: string, siblings: (string | null)[]) => (
  <div className="grid grid-flow-col justify-between">
    <Link
      className=" text-2xl hover:text-4xl"
      to={`/ePub/${fileId}/${siblings[0]}`}
    >
      {siblings[0] ? "<" : ""}
    </Link>
    <Link
      className="text-2xl hover:text-4xl"
      to={`/ePub/${fileId}/${siblings[1]}`}
    >
      {siblings[1] ? ">" : ""}
    </Link>
  </div>
);

export default function () {
  const html = useLoaderData();
  const book = useMatchesData<EPub>("routes/ePub/$fileId");
  const { fileId, id } = useParams();
  const siblings = useMemo(
    () => getAdjacentFlow(id!, book.flow),
    [id, book.flow]
  );

  return (
    <main>
      {renderPageNavigation(fileId!, siblings)}
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {renderPageNavigation(fileId!, siblings)}
    </main>
  );
}
