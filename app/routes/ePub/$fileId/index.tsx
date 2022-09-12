import { LoadingOutlined } from '@ant-design/icons';
import { type LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from '@remix-run/react';
import EPub from 'epub';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { getEPub } from "~/utils/google.drive.server";
import { bookConfigState } from '~/utils/state/book.config';

export const loader: LoaderFunction = async ({ params }) => {
  const { fileId } = params;
  return getEPub(fileId!);
};

export default function Index() {
  const book = useLoaderData<EPub>();
  const { fileId } = useParams();
  const { track: { page = '' } } = useRecoilValue(bookConfigState);
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/ePub/${fileId}/${page || book.flow[0].id}`);
  }, []);

  return (
    <LoadingOutlined className='text-8xl m-auto w-full' />
  );
}