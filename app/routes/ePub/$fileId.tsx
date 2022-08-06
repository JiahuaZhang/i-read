import { MenuOutlined, ProfileOutlined, SettingOutlined } from "@ant-design/icons";
import { type LoaderFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { Menu } from "antd";
import { useCallback, useState } from "react";
import { ConfigPanel } from "~/components/ePub/sideBar/configPanel/ConfigPanel";
import { Note } from '~/components/ePub/sideBar/Note';
import TableOfContent from "~/components/ePub/sideBar/TableOfContent";
import { RecoilSyncIndexedDB } from "~/components/recoil/RecoilSyncIndexedDB";
import { getEPub } from "~/utils/google.drive.server";
import { useResize } from "~/utils/hook/useResize";
export { ErrorBoundary } from "../index";

export const loader: LoaderFunction = async ({ params }) => {
  const { fileId = "" } = params;
  return getEPub(fileId);
};

enum SidebarState {
  Off = "Off",
  Menu = "Menu",
  Config = "Config",
  Note = "Note"
}

export default function () {
  const [sidebarState, setSidebarState] = useState(SidebarState.Menu);
  const { width, mount, unmount } = useResize();

  const toggleMenu = useCallback(
    (state: SidebarState) =>
      setSidebarState((prev) => (prev === state ? SidebarState.Off : state)),
    [setSidebarState]
  );

  const menuItems = [
    {
      label: <MenuOutlined onClick={() => toggleMenu(SidebarState.Menu)} />,
      key: SidebarState.Menu
    },
    {
      label: (
        <SettingOutlined onClick={() => toggleMenu(SidebarState.Config)} />
      ),
      key: SidebarState.Config
    },
    {
      label: <ProfileOutlined onClick={() => toggleMenu(SidebarState.Note)} />,
      key: SidebarState.Note
    }
  ];

  return (
    <RecoilSyncIndexedDB>
      <div className="grid h-screen">
        <Menu
          mode="horizontal"
          selectedKeys={[sidebarState]}
          items={menuItems}
          className='[&>li]:leading-10'
        />
        <section
          className="inline-grid min-h-0 h-full"
          style={{ gridTemplateColumns: "max-content max-content 1fr" }}
        >
          <aside
            className="overflow-y-auto"
            style={{ width: sidebarState === SidebarState.Off ? 0 : width }}
          >
            {sidebarState === SidebarState.Menu && <TableOfContent />}
            {sidebarState === SidebarState.Config && <ConfigPanel />}
            {sidebarState === SidebarState.Note && <Note />}
          </aside>
          <div
            className={`${sidebarState === SidebarState.Off ? "w-0" : "w-[6px]"} cursor-ew-resize bg-gray-200`}
            onMouseDown={mount}
            onMouseUp={unmount}
          />
          <main className="min-h-0 h-full">
            <Outlet />
          </main>
        </section>
      </div>
    </RecoilSyncIndexedDB>
  );
}
