import { Menu } from "antd";
import type EPub from "epub";
import { Link, useLoaderData, useParams } from "@remix-run/react";

const filterToc = (contents: EPub.TocElement[]) => {
  const uniq: { [key: string]: boolean } = {};
  return contents.filter(
    (content) => !uniq[content.id] && (uniq[content.id] = true)
  );
};

type Content = {
  title: string;
  id: string;
  children?: Content[];
};

const getNestedContents = (contents: EPub.TocElement[]) => {
  const trackers: Content[] = [];
  const result: Content[] = [];
  contents.forEach(({ title, level, id }) => {
    const current: Content = { title, id, children: [] };
    if (!trackers[level - 1]) {
      result.push(current);
    } else {
      trackers[level - 1].children?.push(current);
    }
    trackers[level] = current;
  });
  return result;
};

const renderContent = (content: Content, fileId: string) => {
  const { title, id, children } = content;

  if (children?.length) {
    return (
      <Menu.SubMenu
        key={id}
        title={<Link to={`/ePub/${fileId}/${id}`}> {title}</Link>}
      >
        {children.map((child) => renderContent(child, fileId))}
      </Menu.SubMenu>
    );
  }

  return (
    <Menu.Item key={id}>
      <Link to={`/ePub/${fileId}/${id}`}>{title}</Link>
    </Menu.Item>
  );
};

const getSelectedkeys = (id: string, contents: Content[]): string[] => {
  for (const content of contents) {
    if (content.id === id) {
      return [id];
    } else if (content.children?.length) {
      const result = getSelectedkeys(id, content.children);
      if (result.length) {
        return [content.id, ...result];
      }
    }
  }
  return [];
};

export default function TableOfContent() {
  const book = useLoaderData<EPub>();
  const organizedToc = getNestedContents(filterToc(book.toc));
  const { fileId, id } = useParams();
  const keys = getSelectedkeys(id!, organizedToc);

  return (
    <Menu mode="inline" selectedKeys={keys} defaultOpenKeys={keys}>
      {organizedToc.map((content) => renderContent(content, fileId!))}
    </Menu>
  );
}
