import { type LoaderFunction } from "remix";
import { getEPubToc, testSingleEpub } from "~/utils/google.drive";

export const loader: LoaderFunction = async ({ params }) => {
  const { content = "" } = params;

  const epub = await testSingleEpub();

  const result = getEPubToc(epub, content);

  return content;
};

const Content = () => {
  return <div>Content</div>;
};

export default Content;
