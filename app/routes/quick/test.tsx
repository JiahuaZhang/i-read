import type EPub from "epub";
import { type LoaderFunction, useLoaderData, Link } from "remix";
import { testSingleEpub } from "~/utils/google.drive";

export const loader: LoaderFunction = async () => {
  const epub = await testSingleEpub();
  return epub;
};

const GoogleDrive = () => {
  const epub = useLoaderData<EPub>();

  console.log(epub);

  return (
    <div>
      <ul>
        {epub.flow.map((flow) => (
          <li key={flow.id}>
            <Link to={`/quick/${flow.id}`}>{flow.id}</Link>
          </li>
        ))}
      </ul>

      <ul>
        {epub.toc.map((content) => (
          <li key={content.id}>
            <Link to={`/quick/toc/${content.id}`}> {content.id} </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoogleDrive;
