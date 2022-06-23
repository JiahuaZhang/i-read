import type EPub from "epub";
import { Link } from "remix";
import { useMatchesData } from "~/utils";

export default function () {
  const book = useMatchesData<EPub>("routes/ePub/$fileId");

  return (
    <div>
      <aside>
        <ul>
          {book.flow.map((flow) => (
            <li key={flow.id}>
              <Link to={`./${flow.id}`}>{flow.id}</Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
