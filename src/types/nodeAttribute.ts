type AttributeVisibility = 'filters' | 'profile' | 'search';

export type NodeAttribute = {
  id: string,
  isNumeric: boolean,
  visibility: AttributeVisibility[],
  visible: boolean,
  title: string,
  isInteger: boolean,
  attrType?: string,
  bounds?: {
    max: number,
    min: number;
  }
}
