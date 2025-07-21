import React from 'react';
import { useFieldArray, Controller, useWatch } from 'react-hook-form';
import { Input, Select, Card, Button, Space } from 'antd';
import NestedFields from './nestedFields'; // for recursion

const { Option } = Select;

export default function nestedFields({ control, nestPath }) {
  const { fields, append, remove } = useFieldArray({ control, name: nestPath });

  // Watch all nested values for this path
  const watchedFields = useWatch({ control, name: nestPath });

  return (
    <div style={{ paddingLeft: 20, borderLeft: '2px solid #eee', marginTop: 10 }}>
      {fields.map((field, index) => {
        const currentType = watchedFields?.[index]?.type;
        const childrenPath = `${nestPath}.${index}.children`;

        return (
          <Card
            key={field.id}
            size="small"
            title={`Nested Field ${index + 1}`}
            extra={<Button danger onClick={() => remove(index)}>Delete</Button>}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Controller
                control={control}
                name={`${nestPath}.${index}.name`}
                render={({ field }) => <Input {...field} placeholder="Field Name" />}
              />

              <Controller
                control={control}
                name={`${nestPath}.${index}.type`}
                render={({ field }) => (
                  <Select {...field} style={{ width: '100%' }} placeholder="Field Type">
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

              {(currentType === 'nested' || currentType === 'array') && (
                <NestedFields control={control} nestPath={childrenPath} />
              )}
            </Space>
          </Card>
        );
      })}

      <Button type="dashed" onClick={() => append({ name: '', type: 'string', children: [] })}>
        Add Nested Field
      </Button>
    </div>
  );
}
