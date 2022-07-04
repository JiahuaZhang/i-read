import { Menu } from "antd";
import type EPub from "epub";
import { Link, useLoaderData, useParams } from "remix";

const filterToc = (contents: EPub.TocElement[]) => {
  const uniq: { [key: string]: boolean } = {};
  return contents.filter(
    (content) => !uniq[content.id] && (uniq[content.id] = true)
  );
};

type Content = {
  title: string;
  href: string;
  id: string;
  children?: Content[];
};

const getNestedContents = (contents: EPub.TocElement[]) => {
  const trackers: Content[] = [];
  const result: Content[] = [];
  contents.forEach(({ href, title, level, id }) => {
    const current: Content = { href, title, id, children: [] };
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
  const { href, title, id, children } = content;

  if (children?.length) {
    return (
      <Menu.SubMenu
        key={href}
        title={<Link to={`/ePub/${fileId}/${id}`}> {title}</Link>}
      >
        {children.map((child) => renderContent(child, fileId))}
      </Menu.SubMenu>
    );
  }

  return (
    <Menu.Item key={href}>
      <Link to={`/ePub/${fileId}/${id}`}>{title}</Link>
    </Menu.Item>
  );
};

export default function TableOfContent() {
  const book = useLoaderData<EPub>();
  const organizedToc = getNestedContents(filterToc(book.toc));
  const { fileId } = useParams();

  return (
    <Menu mode="inline">
      {organizedToc.map((content) => renderContent(content, fileId!))}
    </Menu>
  );
}
