export const defaultField = () => ({ name: '', type: 'string' });

export const generateJson = (fields = []) => {
  const result = {};
  for (const field of fields) {
    if (field.type === 'nested' && Array.isArray(field.children)) {
      result[field.name || ''] = generateJson(field.children);
    } else {
      result[field.name || ''] = (field.type || 'string').toUpperCase();
    }
  }
  return result;
};
