import React from 'react';
import { Form, Select } from 'antd';

const { Option } = Select;

const SelectInput = ({
    title,
    name,
    rules,
    placeholder,
    options,
    mode,
    allowClear,
    disabled,
    onChange,
    tokenSeparators,
    ...rest
}) => {
    return (
        <Form.Item name={name} label={title} rules={rules} {...rest}>
            <Select
                placeholder={placeholder}
                mode={mode}
                allowClear={allowClear}
                disabled={disabled}
                onChange={onChange}
                tokenSeparators={tokenSeparators}
            >
                {options &&
                    options.map((option) => (
                        <Option key={option.value} value={option.value}>
                            {option.label}
                        </Option>
                    ))}
            </Select>
        </Form.Item>
    );
};

export default SelectInput;
