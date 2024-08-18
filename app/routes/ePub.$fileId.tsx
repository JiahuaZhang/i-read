import { EditOutlined, MenuOutlined, ProfileOutlined, SettingOutlined } from '@ant-design/icons';
import { LoaderFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { Menu } from 'antd';
import { useCallback, useState } from 'react';
import { getEPub } from '~/.server/google/drive';
import { requireUser } from '~/.server/session';
import { ConfigPanel } from '~/component/ePub/sideBar/configPanel/ConfigPanel';
import { Note } from '~/component/ePub/sideBar/Note';
import TableOfContent from '~/component/ePub/sideBar/TableOfContent';
import { Editor } from '~/component/lexical.dev/Editor';
import { RecoilSyncIndexedDB } from '~/component/recoil/RecoilSyncIndexedDB';
import { useResize } from '~/util/hook/useResize';

export const loader: LoaderFunction = async ({ request, params }) => {
  const { fileId = "" } = params;
  const user = await requireUser(request);
  return getEPub(user, fileId);
};

enum SidebarState {
  Off = 'off',
  Menu = 'menu',
  Config = 'config',
  Note = 'note',
  MindMap = 'mindMap',
}
const leftGroup = [SidebarState.Menu, SidebarState.Config, SidebarState.Note];
const rightGroup = [SidebarState.MindMap];

const containsLeftSidebar = (states: SidebarState[]) => states.some(state => leftGroup.includes(state));
const containsRightSidebar = (states: SidebarState[]) => states.some(state => rightGroup.includes(state));

const rightResize = (event: MouseEvent) => {
  const bookSection = document.querySelector('#book-section')!;
  const DRAG_BAR_WIDTH = 6;
  return (bookSection.clientWidth) - event.clientX - DRAG_BAR_WIDTH;
};

export default function () {
  const [sidebarState, setSidebarState] = useState(SidebarState.Off);
  const { width: leftWidth, mount: leftMount, unmount: leftUnmount } = useResize();
  const { width: rightWidth, mount: rightMount, unmount: rightUnmount } = useResize({ initWidth: 600, resize: rightResize });

  const toggleMenu = useCallback(
    (state: SidebarState) => setSidebarState(prev => prev === state ? SidebarState.Off : state),
    [setSidebarState]
  );

  const menuItems = [
    {
      label: <MenuOutlined className='p-2' onClick={() => toggleMenu(SidebarState.Menu)} />,
      key: SidebarState.Menu,
    },
    {
      label: <SettingOutlined className='p-2' onClick={() => toggleMenu(SidebarState.Config)} />,
      key: SidebarState.Config,
    },
    {
      label: <ProfileOutlined className='p-2' onClick={() => toggleMenu(SidebarState.Note)} />,
      key: SidebarState.Note,
    },
    {
      label: <EditOutlined className='p-2' onClick={() => toggleMenu(SidebarState.MindMap)} />,
      key: SidebarState.MindMap,
    },
  ];

  return (
    <RecoilSyncIndexedDB>
      <div className="grid h-screen w-screen" style={{ gridTemplateRows: 'max-content 1fr' }}>
        <Menu
          mode="horizontal"
          selectedKeys={[sidebarState]}
          items={menuItems}
          className='[&>li:nth-last-child(2)]:ml-auto'
          un-px='2'
        />

        <section
          id='book-section'
          className="inline-grid min-h-0 h-full w-full min-w-0"
          style={{ gridTemplateColumns: "max-content max-content 1fr max-content max-content" }}
        >
          <aside
            className="overflow-y-auto"
            style={{ width: !containsLeftSidebar([sidebarState]) ? 0 : leftWidth }}
          >
            {sidebarState.includes(SidebarState.Menu) && <TableOfContent />}
            {sidebarState.includes(SidebarState.Config) && <ConfigPanel />}
            {sidebarState.includes(SidebarState.Note) && <Note />}
          </aside>
          <div
            className={`${!containsLeftSidebar([sidebarState]) ? "w-0" : "w-[6px]"} cursor-ew-resize bg-gray-200`}
            onMouseDown={leftMount}
            onMouseUp={leftUnmount}
          />
          <main className="min-h-0 h-full min-w-0">
            <Outlet />
          </main>
          <div
            className={`${!containsRightSidebar([sidebarState]) ? 'w-0' : 'w-[6px]'} cursor-ew-resize bg-gray-200`}
            onMouseDown={rightMount}
            onMouseUp={rightUnmount}
          />
          <aside
            className='overflow-y-auto' style={{ width: !containsRightSidebar([sidebarState]) ? 0 : rightWidth }}
            onKeyUp={e => {
              if (['ArrowRight', 'ArrowLeft'].includes(e.key)) {
                e.nativeEvent.stopImmediatePropagation();
              }
            }}
          >
            <Editor />
          </aside>
        </section>
      </div>
    </RecoilSyncIndexedDB>
  );
}
