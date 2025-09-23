import React from 'react';
import { Form, Input } from 'antd';

const { TextArea } = Input;

const TextField = ({ title, name, rules, placeholder, rows, disabled }) => {
    return (
        <Form.Item name={name} label={title} rules={rules}>
            <TextArea
                rows={rows}
                placeholder={placeholder}
                disabled={disabled}
            />
        </Form.Item>
    );
};

export default TextField;
