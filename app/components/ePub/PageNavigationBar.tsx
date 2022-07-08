import type EPub from "epub";
import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "remix";
import { useMatchesData } from "~/utils";

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
  <div className="sticky top-0 grid grid-flow-col justify-between text-indigo-600">
    <Link
      className=" text-2xl hover:text-5xl"
      to={`/ePub/${fileId}/${siblings[0]}`}
    >
      {siblings[0] ? "<" : ""}
    </Link>
    <Link
      className="text-2xl hover:text-5xl"
      to={`/ePub/${fileId}/${siblings[1]}`}
    >
      {siblings[1] ? ">" : ""}
    </Link>
  </div>
);

export const PageNavigationBar = () => {
  const book = useMatchesData<EPub>("routes/ePub/$fileId");
  const { fileId, id } = useParams();
  const siblings = useMemo(
    () => getAdjacentFlow(id!, book.flow),
    [id, book.flow]
  );
  const navigate = useNavigate();

  useEffect(() => {
    const keyNavigate = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && siblings[0]) {
        navigate(`/ePub/${fileId}/${siblings[0]}`);
      } else if (event.key === "ArrowRight" && siblings[1]) {
        navigate(`/ePub/${fileId}/${siblings[1]}`);
      }
    };

    document.addEventListener("keyup", keyNavigate);

    return () => document.removeEventListener("keyup", keyNavigate);
  }, [siblings, navigate, fileId]);

  return renderPageNavigation(fileId!, siblings);
};
