import { useEffect, useState } from "react";
import { useAngularElementScope } from "../../hooks/useAngularElementScope";
import { NodeAttribute } from "../../types/nodeAttribute";
import { Node } from "../../types/node";

const DEFAULT_SELECTION_COLOR = '#A3B8C2';

export const BinVisualization = ({
    nBins,
    attribute
}: {
    nBins: number,
    attribute: NodeAttribute
}) => {
    const numberOfBins = nBins > 30 ? 30 : nBins;
    const { scope: selectionInfoScope } = useAngularElementScope('dir-selection-info');
    const [selectedBins, setSelectedBins] = useState<number[]>([]);
    const [selectionColor, setSelectionColor] = useState(DEFAULT_SELECTION_COLOR);

    useEffect(() => {
        if (!selectionInfoScope) {
            return;
        }

        const onSelectHandler = (_: unknown, data: { nodes: Node[] }) => {
            const binStep = (attribute.bounds!.max - attribute.bounds!.min) / numberOfBins;
            const bins = Array.from({ length: numberOfBins }, (_, index) => {
                return index * binStep;
            });

            const nodeColorSet = new Set<string>();

            const selectedBins = bins.map((bin, binIdx) => ({
                binValue: bin,
                binIdx
            })).filter(bin => {
                return data.nodes.some(node => {
                    const value = node.attr[attribute.id];
                    if (typeof value !== 'number') {
                        return undefined;
                    }

                    const isInBin = value >= bin.binValue && value < bin.binValue + binStep;
                    if (isInBin) {
                        nodeColorSet.add(node.colorStr);
                    }
                    return isInBin;
                });
            });

            if (nodeColorSet.size === 1) {
                setSelectionColor(Array.from(nodeColorSet)[0]);
            } else {
                setSelectionColor(DEFAULT_SELECTION_COLOR);
            }

            setSelectedBins(selectedBins.map(bin => bin.binIdx));
        }

        const deregisterHandler = selectionInfoScope.$on('hss:select', onSelectHandler);

        return () => {
            deregisterHandler();
        }
    }, [selectionInfoScope]);

    const binWidth = 100 / numberOfBins;

    if (selectedBins.length === 0) {
        return null;
    }

    return (
        <div style={{
            width: '100%',
            height: '4px',
            position: 'relative',
            marginBottom: '8px'
        }}>
            {Array.from({ length: numberOfBins }).map((_, index) => {
                const isHighlighted = selectedBins.includes(index);
                return (
                    <div
                        key={index}
                        style={{
                            position: 'absolute',
                            left: `${index * binWidth}%`,
                            width: `${binWidth}%`,
                            height: '100%',
                            backgroundColor: isHighlighted ? selectionColor : 'transparent',
                            transition: 'background-color 0.2s'
                        }}
                    />
                );
            })}
        </div>
    );
};