import { MenuOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useState } from "react";
import { type LoaderFunction, Outlet } from "remix";
import TableOfContent from "~/components/ePub/TableOfContent";
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
}

export default function () {
  const [sidebarState, setSidebarState] = useState(SidebarState.Menu);
  const { width, mount, unmount } = useResize();

  return (
    <div className="grid h-screen">
      <Menu
        mode="horizontal"
        selectedKeys={[sidebarState]}
        className="flex h-12"
      >
        <Menu.Item
          key={SidebarState.Menu}
          onClick={() =>
            setSidebarState((prev) =>
              prev === SidebarState.Off ? SidebarState.Menu : SidebarState.Off
            )
          }
        >
          <MenuOutlined />
        </Menu.Item>
      </Menu>
      <section
        className="grid h-[calc(100vh-3rem)]"
        style={{ gridTemplateColumns: "max-content max-content 1fr" }}
      >
        <aside
          className="overflow-y-auto"
          style={{ width: sidebarState === SidebarState.Off ? 0 : width }}
        >
          <TableOfContent />
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
  );
}
