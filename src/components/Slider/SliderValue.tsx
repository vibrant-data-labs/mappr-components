import { useEffect, useState } from "react";
import { getReadableNumber } from "../../utils/numberUtils"
import { NumericFormat } from "react-number-format";
import { CheckIcon } from "../../icons/Check";
import { NodeAttribute } from "../../types/nodeAttribute";

type SliderValueProps = {
    isLog: boolean,
    attr: NodeAttribute,
    startValue: number | undefined,
    endValue: number | undefined,
    onValueChange?: (vals: [number, number]) => void,
    onLogToggleChange?: (isLog: boolean) => void,
}

export const SliderValue = ({ isLog, attr, startValue, endValue, onValueChange, onLogToggleChange }: SliderValueProps) => {
    const [isInEditMode, setIsInEditMode] = useState(false);
    const [val, setVal] = useState<[number, number]>([startValue || 0, endValue || 0]);

    useEffect(() => {
        if (startValue === undefined || endValue === undefined) {
            return;
        }

        setVal([startValue, endValue]);
    }, [startValue, endValue])

    const handleValueChanged = () => {
        setIsInEditMode(false);
        onValueChange?.(val);
    }

    const minValue = attr.bounds?.min || 0;
    const maxValue = attr.bounds?.max || 0;

    const sv = minValue > val[0] ? minValue : val[0];
    const ev = maxValue < val[1] ? maxValue : val[1];


    const formatNumber = (num: number, attr: NodeAttribute) => {
        const logValue = isLog ? Math.log10(num ? num : num + 0.01) : num;
        if (attr.attrType === 'year') {
            return num;
        }
        return getReadableNumber(logValue);
    }

    return <>
        {!isInEditMode &&
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
            }}>
                <div onClick={() => setIsInEditMode(true)} style={{
                    cursor: 'pointer',
                    borderBottom: '1px dashed #000',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '.5em',
                }}>
                    <span>
                        {formatNumber(sv, attr)}
                    </span>
                    <span>
                        to
                    </span>
                    <span>
                        {formatNumber(ev, attr)}
                    </span>
                </div>
                {(attr?.bounds?.min || 0) >= 0 && <div>
                    <input type="checkbox" checked={isLog} onChange={() => onLogToggleChange?.(!isLog)} />
                    <label style={{
                        margin: 0,
                    }}>log</label>
                </div>}
            </div>
        }
        {isInEditMode &&
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '.5em',
            }}>
                <NumericFormat
                    value={isLog ? Math.log10(val[0]) : val[0]}
                    thousandSeparator
                    style={{
                        border: '1px solid #ebeff2',
                        borderRadius: '4px',
                        font: '400 15px/1 Poppins',
                        color: '#000',
                    }}
                    max={val[1]}
                    onValueChange={(values) => {
                        setVal([isLog ? Math.pow(10, values.floatValue || val[0]) : values.floatValue || val[0], val[1]]);
                    }}
                />
                <NumericFormat
                    value={isLog ? Math.log10(val[1]) : val[1]}
                    thousandSeparator
                    style={{
                        border: '1px solid #ebeff2',
                        borderRadius: '4px',
                        font: '400 15px/1 Poppins',
                        color: '#000',
                    }}
                    min={val[0]}
                    onValueChange={(values) => {
                        setVal([val[0], isLog ? Math.pow(10, values.floatValue || val[0]) : values.floatValue || val[0]]);
                    }}
                />
                <button onClick={handleValueChanged}>
                    <CheckIcon />
                </button>
            </div>
        }
    </>
}
