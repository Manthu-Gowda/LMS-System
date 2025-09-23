import React from 'react';
import { Form, Input } from 'antd';

const FormInputs = ({
    title,
    name,
    rules,
    placeholder,
    type = 'text',
    disabled,
    maxLength,
    size = 'large',
    ...rest
}) => {
    return (
        <Form.Item name={name} label={title} rules={rules} {...rest}>
            {type === 'password' ? (
                <Input.Password
                    placeholder={placeholder}
                    disabled={disabled}
                    size={size}
                    maxLength={maxLength}
                />
            ) : (
                <Input
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                    size={size}
                    maxLength={maxLength}
                    min={type === 'number' ? 0 : undefined}
                />
            )}
        </Form.Item>
    );
};

export default FormInputs;
