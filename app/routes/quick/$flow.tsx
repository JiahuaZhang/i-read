import { useLoaderData, type LoaderFunction } from "remix";
import { getEPubChater, testSingleEpub } from "~/utils/google.drive";

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const { flow = "" } = params;

  const epub = await testSingleEpub();

  return getEPubChater(epub, flow);
};

const Flow = () => {
  const text = useLoaderData();
  // console.log(text);

  return <div dangerouslySetInnerHTML={{ __html: text }}></div>;
};

export default Flow;
