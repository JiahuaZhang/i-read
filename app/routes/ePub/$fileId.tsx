import { EditOutlined, MenuOutlined, ProfileOutlined, SettingOutlined } from "@ant-design/icons";
import { type LoaderFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { Menu } from "antd";
import { useCallback, useState } from "react";
import { ConfigPanel } from "~/components/ePub/sideBar/configPanel/ConfigPanel";
import { Note } from '~/components/ePub/sideBar/Note';
import TableOfContent from "~/components/ePub/sideBar/TableOfContent";
import { Editor } from '~/components/lexical.dev/Editor';
import { RecoilSyncIndexedDB } from "~/components/recoil/RecoilSyncIndexedDB";
import { getEPub } from "~/utils/google.drive.server";
import { useResize } from "~/utils/hook/useResize";
export { ErrorBoundary } from "../index";

export const loader: LoaderFunction = async ({ params }) => {
  const { fileId = "" } = params;
  return getEPub(fileId);
};

enum SidebarState {
  Menu = "Menu",
  Config = "Config",
  Note = "Note",
  MindMap = "MindMap",
}
const leftGroup = [SidebarState.Menu, SidebarState.Config, SidebarState.Note];
const rightGroup = [SidebarState.MindMap];

const containsLeftSidebar = (states: SidebarState[]) => states.some(state => leftGroup.includes(state));
const containsRightSidebar = (states: SidebarState[]) => states.some(state => rightGroup.includes(state));
const isSameGroup = (a: SidebarState, b: SidebarState) =>
  (leftGroup.includes(a) && leftGroup.includes(b)) || (rightGroup.includes(a) && rightGroup.includes(b));

const rightResize = (event: MouseEvent) => {
  const bookSection = document.querySelector('#book-section')!;
  const DRAG_BAR_WIDTH = 6;
  return (bookSection.clientWidth) - event.clientX - DRAG_BAR_WIDTH;
};

export default function () {
  const [sidebarState, setSidebarState] = useState<SidebarState[]>([]);
  const { width: leftWidth, mount: leftMount, unmount: leftUnmount } = useResize();
  const { width: rightWidth, mount: rightMount, unmount: rightUnmount } = useResize({ initWidth: 600, resize: rightResize });

  const toggleMenu = useCallback(
    (state: SidebarState) =>
      setSidebarState((prev) => {
        if (prev.includes(state)) return prev.filter(p => p !== state);

        return [...prev.filter(p => !isSameGroup(p, state)), state];
      }),
    [setSidebarState]
  );

  const menuItems = [
    {
      label: <MenuOutlined className='p-4' onClick={() => toggleMenu(SidebarState.Menu)} />,
      key: SidebarState.Menu
    },
    {
      label: (
        <SettingOutlined className='p-4' onClick={() => toggleMenu(SidebarState.Config)} />
      ),
      key: SidebarState.Config
    },
    {
      label: <ProfileOutlined className='p-4' onClick={() => toggleMenu(SidebarState.Note)} />,
      key: SidebarState.Note
    },
    {
      label: <EditOutlined className='p-4' onClick={() => toggleMenu(SidebarState.MindMap)} />,
      key: SidebarState.MindMap
    },
  ];

  return (
    <RecoilSyncIndexedDB>
      <div className="grid h-screen w-screen" style={{ gridTemplateRows: 'max-content 1fr' }}>
        <Menu
          mode="horizontal"
          selectedKeys={sidebarState}
          items={menuItems}
          className='[&>li:nth-last-child(2)]:ml-auto'
        />

        <section
          id='book-section'
          className="inline-grid min-h-0 h-full w-full min-w-0"
          style={{ gridTemplateColumns: "max-content max-content 1fr max-content max-content" }}
        >
          <aside
            className="overflow-y-auto"
            style={{ width: !containsLeftSidebar(sidebarState) ? 0 : leftWidth }}
          >
            {sidebarState.includes(SidebarState.Menu) && <TableOfContent />}
            {sidebarState.includes(SidebarState.Config) && <ConfigPanel />}
            {sidebarState.includes(SidebarState.Note) && <Note />}
          </aside>
          <div
            className={`${!containsLeftSidebar(sidebarState) ? "w-0" : "w-[6px]"} cursor-ew-resize bg-gray-200`}
            onMouseDown={leftMount}
            onMouseUp={leftUnmount}
          />
          <main className="min-h-0 h-full min-w-0">
            <Outlet />
          </main>
          <div
            className={`${!containsRightSidebar(sidebarState) ? 'w-0' : 'w-[6px]'} cursor-ew-resize bg-gray-200`}
            onMouseDown={rightMount}
            onMouseUp={rightUnmount}
          />
          <aside
            className='overflow-y-auto' style={{ width: !containsRightSidebar(sidebarState) ? 0 : rightWidth }}
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
