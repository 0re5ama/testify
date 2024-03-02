import { memo, useEffect } from 'react';

const OPTNONE = {
    id: '',
    name: '--Select--',
};

const Select = memo(({ onChange, name, val, options, caption }) => {
    useEffect(() => {
        if (val) onChange(val);
    }, [val]);

    const opts = caption ? [OPTNONE, ...options] : options;

    return (
        <select
            onChange={(evt) => {
                onChange(evt.target.value);
            }}
            name={name}
            value={val}
        >
            {opts &&
                opts.map((sub, i) => (
                    <option value={sub.val || sub.id} key={i}>
                        {sub.label || sub.name}
                    </option>
                ))}
        </select>
    );
});

export default Select;
