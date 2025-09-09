import { Node } from "./node";
import { NodeAttribute } from "./nodeAttribute";

/* eslint-disable @typescript-eslint/no-explicit-any */
type RootScope = {
  $on: (event: string, callback: (event: any) => void) => void;
  geo: {
    level: string;
  }
}

type DataGraph = {
  getNodeAttrs: () => NodeAttribute[]
  getRawData: () => Promise<any>;
  getAllNodes: () => Node[];
}

type SelectService = {
  getSelectedNodes: () => Node[];
  selectSingleNode: (id: string, listPanelPrevent: boolean) => void;
  selectNodes: (data: { attr: string, forceDisable?: boolean, min?: number, max?: number, force?: boolean }) => void;
  hasFilter: (attrId: string) => boolean;
}

type SubsetService = {
  subsetNodes: Node[];
}


export type ShortLayout = {
  scalers: {
    color: (value: string) => string
  },
  geoBuckets?: Record<string, {
    color: string;
    nodes: Node[];
  }[]>;
}
type LayoutService = {
  getCurrentIfExists: () => ShortLayout;
  getCurrent: () => Promise<ShortLayout>;
  ScaleBuilder: any;
}

type HoverArgs = {
  ids: string | string[]
}

type HoverService = {
  hoverNodes: (args: HoverArgs) => void;
  unhover: () => void;
}

export type ServiceTypings = {
  '$rootScope': RootScope,
  'dataGraph': DataGraph,
  'selectService': SelectService,
  'subsetService': SubsetService,
  'layoutService': LayoutService,
  'hoverService': HoverService
}