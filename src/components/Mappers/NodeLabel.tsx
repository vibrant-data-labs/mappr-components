import { useGraphContext } from "../../context/GraphContext"
import { Node } from "../../types/node"

type NodeLabelProps = {
  node: Node
}

export const NodeLabel = ({ node }: NodeLabelProps) => {
  const { settings } = useGraphContext();

  if (!settings) return null;

  return node.attr[settings.labelAttr];
}
