import { GraphProvider } from "../../context/GraphContext"
import { SelectionInfo } from "./SelectionInfo"

export const SelectionInfoContainer = () => {
  return <GraphProvider>
    <SelectionInfo />
  </GraphProvider>
}