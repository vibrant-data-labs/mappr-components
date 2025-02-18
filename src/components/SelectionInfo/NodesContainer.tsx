import { Node } from "../../types/node";
import { NodesList } from "./NodesList";

type NodeContainerProps = {
  nodes: Node[]
}

export const NodesContainer = ({ nodes }: NodeContainerProps) => {
  return (
    <div className="info-item flex-fill-column">
      <div className="panel-list nodes-list panel-list--scrollable">
        <ul className="list-unstyled">
          <NodesList nodes={nodes} />
        </ul>
      </div>
    </div>
  );
}