import { LoadingOutlined } from '@ant-design/icons';
import { useParams } from '@remix-run/react';
import Dexie, { Table } from 'dexie';
import { Suspense } from 'react';
import { RecoilSync } from 'recoil-sync';
import { ClientOnly } from 'remix-utils/client-only';
import { BookConfig, defaultBookConfig, storeKey } from '~/util/state/book.config';

export class MyDexie extends Dexie {
  bookConfig!: Table<BookConfig>;

  constructor() {
    super("ePub");
    this.version(1).stores({
      bookConfig: "fileId",
    });
  }
}

export const dexieDB = new MyDexie();

export const RecoilSyncIndexedDB = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const { fileId = "" } = useParams();

  return (
    <ClientOnly fallback={<LoadingOutlined />}>
      {() => (
        <Suspense fallback={<LoadingOutlined />}>
          <RecoilSync
            storeKey={storeKey}
            read={async () => {
              const storedBookconfig = await dexieDB.bookConfig.get(fileId);
              if (!storedBookconfig) {
                await dexieDB.bookConfig.clear();
                return defaultBookConfig;
              }
              return storedBookconfig;
            }}
            write={async ({ diff }) => {
              for (const [_, value] of diff) {
                await dexieDB.bookConfig.put({
                  ...(value as BookConfig),
                  fileId,
                });
              }
            }}
          >
            {children}
          </RecoilSync>
        </Suspense>
      )}
    </ClientOnly>
  );
};
