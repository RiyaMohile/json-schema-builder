import React, { useEffect, useRef } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Input, Select, Card, Button, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import NestedFields from './nestedFields';
import { defaultField, generateJson } from './utils';

const { Option } = Select;

export default function SchemaBuilder() {
  const { control, watch } = useForm({ defaultValues: { fields: [defaultField()] } });
  const { fields, append, remove } = useFieldArray({ control, name: 'fields' });
  const values = watch('fields');
  const jsonRef = useRef(null);

  useEffect(() => {
    if (jsonRef.current) {
      jsonRef.current.scrollTop = jsonRef.current.scrollHeight;
    }
  }, [values]);

  return (
    <>
      <div className="sticky-header">
        <h1 style={{ color: 'white' }}>JSON Schema Builder</h1>
      </div>

      <div className="main-container">
        <div className="form-section">
          <Space direction="vertical" style={{ width: '100%' }}>
            {fields.map((field, index) => (
              <Card
                key={field.id}
                type="inner"
                title={`Field ${index + 1}`}
                extra={<MinusCircleOutlined onClick={() => remove(index)} style={{ color: 'red' }} />}
              >
                <Space direction="horizontal" wrap style={{ width: '100%' }}>
                  <Controller
                    control={control}
                    name={`fields.${index}.name`}
                    render={({ field }) => (
                      <Input {...field} placeholder="Field Name" style={{ width: 200 }} />
                    )}
                  />
                  <Controller
                    control={control}
                    name={`fields.${index}.type`}
                    render={({ field }) => (
                      <Select {...field} style={{ width: 150 }} placeholder="Field Type">
                        <Option value="string">String</Option>
                        <Option value="number">Number</Option>
                        <Option value="boolean">Boolean</Option>
                        <Option value="float">Float</Option>
                        <Option value="objectId">ObjectId</Option>
                        <Option value="nested">Nested</Option>
                        <Option value="array">Array</Option>
                      </Select>
                    )}
                  />
                </Space>

                {(values?.[index]?.type === 'nested' || values?.[index]?.type === 'array') && (
                  <NestedFields control={control} nestPath={`fields.${index}.children`} />
                )}
              </Card>
            ))}
            <Button type="primary" icon={<PlusOutlined />} onClick={() => append(defaultField())}>
              Add Field
            </Button>
          </Space>
        </div>

        <div className="json-section-sticky" ref={jsonRef}>
          <pre>{JSON.stringify(generateJson(values), null, 2)}</pre>
        </div>
      </div>
    </>
  );
}
