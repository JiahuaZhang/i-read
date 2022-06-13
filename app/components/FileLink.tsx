import { type drive_v3 } from "googleapis";

type Props = {
  file: drive_v3.Schema$File;
};

export const FileLink = (props: Props) => {
  const { file } = props;

  return <span>{file.name}</span>;
};
