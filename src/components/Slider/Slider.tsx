import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { useAngularInjector } from '../../hooks/useAngularInjector';
import { useEffect, useMemo, useRef, useState } from 'react';
import { NodeAttribute } from '../../types/nodeAttribute';
import { useAngularElementScope } from '../../hooks/useAngularElementScope';
import { SliderValue } from './SliderValue';
import { Node } from '../../types/node';

type SliderProps = {
    attrId?: string;
}

const getBins = (attrInfo: NodeAttribute) => {
    const nBins = 20;
    if (!attrInfo.bounds) {
        return nBins;
    }

    if (attrInfo.isInteger && (attrInfo.bounds.max - attrInfo.bounds.min) < 40) {
        return attrInfo.bounds.max - attrInfo.bounds.min + 1;
    }

    if (attrInfo.bounds.max - attrInfo.bounds.min > 100) {
        return attrInfo.bounds.max - attrInfo.bounds.min;
    }

    if (attrInfo.isNumeric && attrInfo.bounds.max === attrInfo.bounds.min) {
        return 1;
    }
    return nBins;
}

const SliderElement = ({ attribute, initialValue }: { attribute: NodeAttribute, initialValue: [number, number] }) => {
    const selectService = useAngularInjector('selectService');
    const { scope: selectionInfoScope } = useAngularElementScope('dir-selection-info');
    const [attr, setAttr] = useState<NodeAttribute>(attribute);
    const [value, setValue] = useState<[number, number]>(initialValue);
    const updateRef = useRef<number | null>(null);
    const [isLog, setIsLog] = useState<boolean>(false);

    const step = useMemo(() => {
        if (!attr || !attr.bounds) {
            return 1;
        }

        const nBins = getBins(attr);

        return (attr.bounds.max - attr.bounds.min) / nBins;
    }, [attr])

    useEffect(() => {
        if (!selectionInfoScope) {
            return;
        }

        const onSelectHandler = (_: unknown) => {
            const hasFilter = selectService?.hasFilter(attr.id);
            if (!hasFilter) {
                setValue([attr!.bounds!.min, attr!.bounds!.max]);
                return;
            }
        }

        const deregisterHandler = selectionInfoScope.$on('hss:select', onSelectHandler);

        return () => {
            deregisterHandler();
        }
    }, [selectionInfoScope]);

    useEffect(() => {
        if (!selectionInfoScope) {
            return;
        }

        const onSubsetHandler = (_: unknown, data: {
            nodes: Node[]
        }) => {
            const bounds = data.nodes.reduce((cv, acc) => {
                const attrVal = acc.attr[attr.id];
                if (attrVal === undefined || attrVal === null) {
                    return cv;
                }

                return {
                    min: Math.min(cv.min, Number(attrVal)),
                    max: Math.max(cv.max, Number(attrVal))
                }
            }, {
                max: Number.NEGATIVE_INFINITY,
                min: Number.POSITIVE_INFINITY
            });

            setAttr(attr => ({
                ...attr!,
                bounds
            }));
        }

        const deregisterHandler = selectionInfoScope.$on('hss:subset:changed', onSubsetHandler);

        return () => {
            deregisterHandler();
        }
    }, [selectionInfoScope]);

    const handleChange = (val: [number, number]) => {
        setValue(val);
        if (updateRef.current) {
            clearTimeout(updateRef.current);
        }

        updateRef.current = setTimeout(() => {
            if (!attr.bounds || !val) {
                return;
            }

            const [startVal, endVal] = val;
            if (startVal == attr.bounds.min && endVal == attr.bounds.max) {
                selectService?.selectNodes({ attr: attr.id, forceDisable: true });
                return;
            }

            if (isLog) {
                selectService?.selectNodes({
                    attr: attr.id,
                    min: Math.pow(10, startVal),
                    max: Math.pow(10, endVal),
                    force: true
                })
            } else {
                selectService?.selectNodes({
                    attr: attr.id,
                    min: startVal,
                    max: endVal,
                    force: true
                })
            }
        }, 300);
    }

    const handleInput = (val: [number, number]) => {
        const [start, end] = val;
        if (Number.isNaN(start) || Number.isNaN(end)) {
            return;
        }

        if (start > end) {
            handleChange([end, start]);
        } else {
            handleChange(val);
        }
    }

    return <div className="range-slider__wrapper">
        {attr && attr.bounds && <RangeSlider
            min={attr.bounds.min}
            max={attr.bounds.max}
            step={step}
            onInput={handleChange}
            defaultValue={value}
            value={[value?.[0] || 0, value?.[1] || 0]} />}
        <span style={{
            marginTop: '.5em',
            width: '100%',
            display: 'block'
        }}>
            <SliderValue isLog={isLog} startValue={value?.[0]} endValue={value?.[1]} attr={attr} onValueChange={handleInput} onLogToggleChange={setIsLog} />
        </span>
    </div>
}

export const Slider = ({ attrId }: SliderProps) => {
    const dataGraph = useAngularInjector('dataGraph');
    const [attr, setAttr] = useState<NodeAttribute | null>(null);
    const [value, setValue] = useState<[number, number] | undefined>([0, 0]);

    useEffect(() => {
        if (!dataGraph) {
            return;
        }

        const nodeAttrs = dataGraph.getNodeAttrs();
        const attrItem = nodeAttrs.find(attr => attr.id === attrId);
        if (!attrItem) {
            return;
        }
        setAttr(attrItem);
    }, [dataGraph]);

    useEffect(() => {
        if (!attr || !attr.bounds) {
            return;
        }

        setValue([attr.bounds.min, attr.bounds.max]);
    }, [attr]);

    if (!attr || !value || value[0] === value[1]) {
        return null;
    }

    return <SliderElement attribute={attr} initialValue={value} />;
}