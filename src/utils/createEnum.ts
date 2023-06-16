type UnionToIntersection<U> = (U extends any ? (k: U) => any : never) extends (k: infer I) => any ? I : never;
type StringOrNum<T> = T extends string ? string : T extends number ? number : never;
// eslint-disable-next-line
type CreateEnum<T> = T extends [infer K, infer V, infer L] ? UnionToIntersection<{ [key in K & string]: V }> : never;

export function createEnum<K extends string, V extends string | number, L, T extends [K, V, L]>(
  args: readonly T[]
): Readonly<
  UnionToIntersection<CreateEnum<T>> & {
    getLabelByValue(key: StringOrNum<T[1]>): T[2];
    options: { value: StringOrNum<T[1]>; label: T[2] }[];
  }
> {
  const obj = Object.create(null);
  const map = new Map<V, L>();
  const options: { value: V; label: L }[] = [];

  for (const [k, v, l] of args) {
    obj[k] = v;
    map.set(v, l);
    options.push({ value: v, label: l });
  }

  return Object.freeze({
    ...obj,
    getLabelByValue: (value: any) => map.get(value),
    options,
  });
}
