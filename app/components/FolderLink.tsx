import { FolderFilled } from "@ant-design/icons";
import { type drive_v3 } from "googleapis";

type Props = {
  file: drive_v3.Schema$File;
};

export const FolderLink = (props: Props) => {
  const { file } = props;

  return (
    <div className="inline-grid grid-flow-col items-end gap-x-2 rounded border-2 border-gray-200 px-2 py-1">
      <FolderFilled className="text-2xl text-amber-300" />
      {file.name}
    </div>
  );
};
