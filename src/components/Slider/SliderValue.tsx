import { useEffect, useState } from "react";
import { PencilIcon } from "../../icons/Pencil"
import { getReadableNumber } from "../../utils/numberUtils"

type SliderValueProps = {
    isLog: boolean,
    value: number,
    onValueChange?: (num: number) => void,
}

export const SliderValue = ({ isLog, value, onValueChange }: SliderValueProps) => {
    const [isInEditMode, setIsInEditMode] = useState(false);
    const [val, setVal] = useState(value);

    useEffect(() => {
        if (isInEditMode) {
            setVal(value);
            return;
        }

        if (onValueChange) {
            onValueChange(val);
        }
    }, [isInEditMode]);

    return <div style={{
        display: 'flex'
    }}>
        {!isInEditMode &&
            getReadableNumber(isLog ? Math.log10(value ? value : value + 0.01) : value)}
        {isInEditMode &&
            <input type="number" style={{
                border: '1px solid #ebeff2',
                borderRadius: '4px',
                font: '400 15px/1 Poppins',
                color: '#000',

            }} value={val} onChange={(e) => {
                const newValue = Number(e.target.value);
                if (newValue) {
                    setVal(newValue);
                }
            }
            } onBlur={() => setIsInEditMode(false)} />}

        <PencilIcon style={{
            margin: '0 .5em',
            cursor: 'pointer',
        }} onClick={() => setIsInEditMode(true)} />
    </div>
}
