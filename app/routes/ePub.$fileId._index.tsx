import { LoadingOutlined } from '@ant-design/icons';
import { LoaderFunction } from '@remix-run/node';
import { useLoaderData, useNavigate, useParams } from '@remix-run/react';
import EPub from 'epub';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { getEPub } from '~/.server/google/drive';
import { requireUser } from '~/.server/session';
import { bookConfigAtom } from '~/util/state/book.config';

export const loader: LoaderFunction = async ({ request, params }) => {
  const { fileId } = params;
  const user = await requireUser(request);
  return getEPub(user, fileId!);
};

export default function Index() {
  const book = useLoaderData<EPub>();
  const { fileId } = useParams();
  const { track: { page = '' } } = useAtomValue(bookConfigAtom);
  const navigate = useNavigate();

  useEffect(() => { navigate(`/ePub/${fileId}/${page || book.flow[0].id}`); }, []);

  return <LoadingOutlined className='text-8xl m-auto w-full' />;
}