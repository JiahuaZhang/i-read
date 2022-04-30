import { LoaderFunction, useLoaderData } from "remix";
import { testSingleEpub } from "~/utils/google.drive";

export const loader: LoaderFunction = async () => {
  const epub = await testSingleEpub();
  return epub;
};

const GoogleDrive = () => {
  const epub = useLoaderData();

  return <div>Test page</div>;
};

export default GoogleDrive;
