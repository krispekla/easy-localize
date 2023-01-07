export function unflatten(data: { [x: string]: any }) {
  if (Object(data) !== data || Array.isArray(data)) return data;
  const result: { [key: string]: any } = {};
  for (const p in data) {
    let cur = result;
    let prop = '';
    const parts = p.split('.');
    for (let i = 0; i < parts.length; i++) {
      const idx = !isNaN(parseInt(parts[i]));
      cur = cur[prop] || (cur[prop] = idx ? [] : {});
      prop = parts[i];
    }
    cur[prop] = data[p];
  }
  return result[''];
}
export function flatten(data: any) {
  const result: { [key: string]: any } = {};
  function recurse(cur: { [key: string]: any }, prop: string) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (let i = 0; i < cur.length; i++) {
        recurse(cur[i], prop ? prop + '.' + i : '' + i);
      }
      if (cur.length === 0) result[prop] = [];
    } else {
      let isEmpty = true;
      for (const p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop + '.' + p : p);
      }
      if (isEmpty) result[prop] = {};
    }
  }
  recurse(data, '');
  return result;
}
