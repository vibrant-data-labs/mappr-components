import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Node } from "../types/node";
import { MapprSettings } from "../types/mapprSettings";
import { NodeAttribute } from "../types/nodeAttribute";
import { useAngularElementScope } from "../hooks/useAngularElementScope";
import { useAngularInjector } from "../hooks/useAngularInjector";
import { ShortLayout } from "../types/services.old";
import { colorScaleFactory } from "../utils/colorScale";

type GraphContextValue = {
  nodes: Node[],
  nodeAttrs: NodeAttribute[],
  layout: ShortLayout | null,
  settings: MapprSettings | null,
  selectedNodeId: string | null,
  selectedScrollDisabled: boolean,
  searchQuery: string,
  colorScaler: ((value: Node) => string) | null,
  setSearchQuery: (query: string) => void
}

export const GraphContext = createContext<GraphContextValue>({
  nodes: [],
  nodeAttrs: [],
  layout: null,
  settings: null,
  selectedNodeId: null,
  selectedScrollDisabled: false,
  colorScaler: null,
  searchQuery: '',
  setSearchQuery: () => { /* no-op */ }
});

export const GraphProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { scope: selectionInfoScope, refreshScope } = useAngularElementScope('dir-selection-info');
  const dataGraph = useAngularInjector('dataGraph')
  const selectService = useAngularInjector('selectService');
  const subsetService = useAngularInjector('subsetService');
  const layoutService = useAngularInjector('layoutService');
  const [nodeAttrs, setNodeAttrs] = useState<NodeAttribute[]>([])
  const [nodes, setNodes] = useState<Node[]>([]);
  const [allNodes, setAllNodes] = useState<Node[]>([]);
  const [layout, setLayout] = useState<ShortLayout | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedScrollDisabled, setSelectedScrollDisabled] = useState<boolean>(false);
  const [colorAttr, setColorAttr] = useState<NodeAttribute | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const colorScaler = useMemo(() => {
    if (!selectionInfoScope?.mapprSettings || !allNodes.length || !nodeAttrs.length) return null;

    return colorScaleFactory(
      colorAttr?.id || selectionInfoScope.mapprSettings.nodeColorAttr,
      selectionInfoScope.mapprSettings.nodeColorDefaultValue,
      selectionInfoScope.mapprSettings.nodeColorPaletteOrdinal,
      nodeAttrs,
      allNodes);
  }, [layout, selectionInfoScope, nodeAttrs, allNodes, nodes, colorAttr]);

  const loadNodes = () => {
    if (!dataGraph || !selectService || !subsetService) return;

    const selectedNodes = selectService.getSelectedNodes();
    const subsetNodes = subsetService.subsetNodes;

    if (selectedNodes.length > 1) {
      setNodes(selectedNodes);
    } else if (subsetNodes.length) {
      setNodes(subsetNodes);
    } else {
      const dataGraphNodes = dataGraph.getAllNodes();
      setNodes(dataGraphNodes);
      setAllNodes(dataGraphNodes);
    }
  }

  useEffect(() => {
    if (!dataGraph) return;

    dataGraph.getRawData().then(() => {
      const nodeAttrs = dataGraph.getNodeAttrs();
      setNodeAttrs(nodeAttrs);
    })

  }, [dataGraph]);

  useEffect(() => {
    loadNodes();
  }, [dataGraph, selectService, subsetService])

  useEffect(() => {
    if (!layoutService) return;
    const currentLayout = layoutService.getCurrentIfExists();
    if (currentLayout) {
      setLayout(currentLayout);
    }
  }, [layoutService])

  useEffect(() => {
    if (!selectionInfoScope) return;

    const onSelectHandler = (_: unknown, { nodes, listPanelPrevent }: { nodes: Node[], listPanelPrevent: boolean }) => {
      if (!nodes) {
        return;
      }

      setSelectedScrollDisabled(listPanelPrevent);

      if (nodes.length === 0) {
        loadNodes();
        setSelectedNodeId(null);
        return;
      }

      if (nodes.length === 1) {
        setSelectedNodeId(nodes[0].id);
        return;
      }

      setNodes(nodes);
    }

    const deregisterHandler = selectionInfoScope.$on('hss:select', onSelectHandler);

    const onSwitchSnapshotHandler = () => {
      if (!layoutService) return;
      const currentLayout = layoutService.getCurrentIfExists();
      if (currentLayout) {
        setLayout(currentLayout);
      }

      refreshScope();
    }
    const deregisterSnapshotHandler = selectionInfoScope.$on('snapshot:changed', onSwitchSnapshotHandler);

    const onColorByChanged = (_: unknown, colorAttr: NodeAttribute) => {
      setColorAttr(colorAttr);
    }

    const deregisterColorByChanged = selectionInfoScope.$on('cb:changed', onColorByChanged);
    return () => {
      deregisterHandler();
      deregisterSnapshotHandler();
      deregisterColorByChanged();
    }
  }, [selectionInfoScope]);


  return (
    <GraphContext.Provider value={{
      nodes,
      nodeAttrs,
      layout,
      settings: selectionInfoScope?.mapprSettings || null,
      selectedNodeId,
      selectedScrollDisabled,
      colorScaler,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </GraphContext.Provider>
  );
};

export const useGraphContext = () => useContext(GraphContext);
