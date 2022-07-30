import { MenuOutlined, SettingOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useCallback, useState } from "react";
import { type LoaderFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { ConfigPanel } from "~/components/ePub/ConfigPanel/ConfigPanel";
import TableOfContent from "~/components/ePub/TableOfContent";
import { getEPub } from "~/utils/google.drive.server";
import { useResize } from "~/utils/hook/useResize";
import { RecoilSyncIndexedDB } from "~/components/recoil/RecoilSyncIndexedDB";
export { ErrorBoundary } from "../index";

export const loader: LoaderFunction = async ({ params }) => {
  const { fileId = "" } = params;
  return getEPub(fileId);
};

enum SidebarState {
  Off = "Off",
  Menu = "Menu",
  Config = "Config"
}

export default function () {
  const [sidebarState, setSidebarState] = useState(SidebarState.Config);
  const { width, mount, unmount } = useResize();

  const toggleMenu = useCallback(
    (state: SidebarState) =>
      setSidebarState((prev) => (prev === state ? SidebarState.Off : state)),
    [setSidebarState]
  );

  const menuItems = [
    { label: <MenuOutlined onClick={() => toggleMenu(SidebarState.Menu)} />,
      key: SidebarState.Menu },
    { label: (
        <SettingOutlined onClick={() => toggleMenu(SidebarState.Config)} />
      ),
      key: SidebarState.Config }
  ];

  return (
    <RecoilSyncIndexedDB>
      <div className="grid h-screen">
        <Menu
          mode="horizontal"
          selectedKeys={[sidebarState]}
          className="flex h-12"
          items={menuItems}
        />
        <section
          className="grid h-[calc(100vh-3rem)]"
          style={{ gridTemplateColumns: "max-content max-content 1fr" }}
        >
          <aside
            className="overflow-y-auto"
            style={{ width: sidebarState === SidebarState.Off ? 0 : width }}
          >
            {sidebarState === SidebarState.Menu && <TableOfContent />}
            {sidebarState === SidebarState.Config && <ConfigPanel />}
          </aside>
          <div
            className={`${
              sidebarState === SidebarState.Off ? "w-0" : "w-[6px]"
            } cursor-ew-resize bg-gray-200`}
            onMouseDown={mount}
            onMouseUp={unmount}
          />
          <main className="h-[calc(100vh-3rem)] overflow-auto">
            <Outlet />
          </main>
        </section>
      </div>
    </RecoilSyncIndexedDB>
  );
}
