import { useMemo, useState } from "react";
import { useGraphContext } from "../../context/GraphContext";
import { NodesContainer } from "./NodesContainer";
import { SortMenu } from "./SortMenu"

type SortDirection = 'asc' | 'desc';

export const SelectionInfo = () => {
  const { nodeAttrs, nodes } = useGraphContext();
  const [sortOrder, setSortOrder] = useState<SortDirection>('asc');
  const [sortField, setSortField] = useState<string | null>(null);

  const renderedNodes = useMemo(() => {
    if (!sortField) return nodes;

    const sortedNodes = [...nodes].sort((a, b) => {
      const aValue = a.attr[sortField];
      const bValue = b.attr[sortField];

      if (aValue === bValue) return 0;

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : 1;
      } else {
        return aValue > bValue ? -1 : 1;
      }
    });

    return sortedNodes;
  }, [nodes, sortField, sortOrder])

  const handleSortFieldChanged = (field: string) => {
    setSortField(field);
  }

  const handleSortOrderChanged = (order: SortDirection) => {
    setSortOrder(order);
  }

  return <>
    <div className="filter-header filter-header--nodes">
      <div className="filter-header__left-part">
        <SortMenu
          sortOrder={sortOrder}
          nodeAttrs={nodeAttrs}
          onSortFieldChanged={handleSortFieldChanged}
          onSortOrderChanged={handleSortOrderChanged} />
      </div>
    </div>
    <div id="info-panel-scroll" className=" panel-scroll flex-fill flex-vert-container">
      <NodesContainer nodes={renderedNodes} />
    </div>
  </>
}