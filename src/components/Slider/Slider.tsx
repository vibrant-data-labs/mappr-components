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

export const Slider = ({ attrId }: SliderProps) => {
    const dataGraph = useAngularInjector('dataGraph');
    const selectService = useAngularInjector('selectService');
    const { scope: selectionInfoScope } = useAngularElementScope('dir-selection-info');
    const [attr, setAttr] = useState<NodeAttribute | null>(null);
    const [value, setValue] = useState<[number, number]>([0, 1]);
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

    useEffect(() => {
        if (!attr || !attr.bounds) {
            return;
        }

        if (updateRef.current) {
            clearTimeout(updateRef.current);
        }

        updateRef.current = setTimeout(() => {
            if (!attr.bounds) {
                return;
            }

            const [startVal, endVal] = value;
            if (startVal == attr.bounds.min && endVal == attr.bounds.max) {
                selectService?.selectNodes({ attr: attrId!, forceDisable: true });
                return;
            }

            if (isLog) {
                selectService?.selectNodes({
                    attr: attrId!,
                    min: Math.pow(10, startVal),
                    max: Math.pow(10, endVal),
                    force: true
                })
            } else {
                selectService?.selectNodes({
                    attr: attrId!,
                    min: startVal,
                    max: endVal,
                    force: true
                })
            }
        }, 300);

        return () => {
            if (updateRef.current) {
                clearTimeout(updateRef.current);
            }
        }
    }, [attr, value]);

    useEffect(() => {
        if (!selectionInfoScope) {
            return;
        }

        const onSelectHandler = (_: unknown, data: any) => {
            if (data.isUnselect) {
                const hasFilter = selectService?.hasFilter(attrId!);
                if (!hasFilter) {
                    setValue([attr!.bounds!.min, attr!.bounds!.max]);
                    return;
                }
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
                const attrVal = acc.attr[attrId!];
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
    }

    const handleInput = (val: [number, number]) => {
        const [start, end] = val;
        if (Number.isNaN(start) || Number.isNaN(end)) {
            return;
        }

        if (start > end) {
            setValue([end, start]);
        } else {
            setValue(val);
        }
    }

    return <div className="range-slider__wrapper">
        {attr && attr.bounds && <RangeSlider
            min={attr.bounds.min}
            max={attr.bounds.max}
            step={step}
            onInput={handleChange}
            defaultValue={value}
            value={value} />}
        <div style={{
            display: 'flex',
            justifyContent: 'space-between'
        }}>
            <label style={{
                display: 'flex',
                marginTop: '.5em',
                alignItems: 'center',
            }}><SliderValue isLog={isLog} value={value[0]} onValueChange={(v) => {
                handleInput([v, value[1]]);
            }} /> — <SliderValue isLog={isLog} value={value[1]} onValueChange={(v) => {
                handleInput([value[0], v]);
            }} /></label>
            {(attr?.bounds?.min || 0) >= 0 && <div style={{
                marginTop: '.5em',
            }}>
                <input type="checkbox" checked={isLog} onChange={() => setIsLog(s => !s)} />
                <label>log</label>
            </div>}
        </div>
    </div>
}