import { hsl } from "d3";
import { Node } from "../types/node";
import { NodeAttribute } from "../types/nodeAttribute";

export const colorScaleFactory = (colorAttribute: string, defaultColor: string, ordinalPalette: { col: string }[], nodeAttributes: NodeAttribute[], nodes: Node[]) => {
  const colorAttr = nodeAttributes.find(attr => attr.id === colorAttribute);
  if (!colorAttr) {
    return () => defaultColor;
  }

  if (colorAttr.isNumeric) {
    return () => defaultColor;
  }

  // get uniq values sorted by frequency of occurence
  const nodeValsFrequency = nodes.filter(cv => Boolean(cv.attr[colorAttr.id])).reduce((acc, node) => {
    const val = node.attr[colorAttr.id];
    if (Array.isArray(val)) {
      val.forEach(v => {
        if (!acc[v]) {
          acc[v] = 0;
        }
        acc[v]++;
      });
      return acc;
    }

    if (!acc[val]) {
      acc[val] = 0;
    }
    acc[val]++;
    return acc;
  }, {} as Record<string, number>);

  const sortedNodeVals = Object.entries(nodeValsFrequency).sort((a, b) => {
    const diff = b[1] - a[1];
    if (diff !== 0) {
      return diff;
    }

    return a[0] > b[0] ? -1 : 1;
}).map(entry => entry[0]);
  return (node: Node) => {
    let val = node.attr[colorAttr.id];
    if (Array.isArray(val)) {
      if (val.length > 0) {
        val = val[0];
      } else {
        return defaultColor;
      }
    }

    const idx = sortedNodeVals.indexOf(val.toString()) % ordinalPalette.length;
    let desat = Math.floor(idx / ordinalPalette.length);
    if (idx < 0) {
      return defaultColor;
    }
    const color = ordinalPalette[idx].col;
    if (desat > 0) {
      const hslC = hsl(color);
      while (desat-- > 0) {
        hslC.s *= 0.6;
      }
      return hslC.toString();
    }
    return color;
  }
}