import * as React from "react";
import { Select } from "antd";

type Has<P extends string, S> = { [Q in P]: S };

export type FilterPredicate<E> = (entry: E, index: number, arr: E[]) => boolean;

type Props<E, P> = {
  tags: Set<string>;
  value: string[];
  property: P;
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
};

export function TagFilter<
  E extends Has<P, S>,
  P extends string,
  S extends string
>(props: Props<E, P>) {
  const { tags, value, property, onAdd, onRemove } = props;
  const filters = React.useMemo(() => Array.from(tags), [tags]);

  return (
    <Select
      style={{ width: "100%" }}
      mode="multiple"
      placeholder={`filter by ${property}...`}
      value={value}
      onSelect={v => onAdd(v as string)}
      onDeselect={v => onRemove(v as string)}
    >
      {filters
        .map(f => f.toString())
        .map(filter => (
          <Select.Option key={filter} value={filter}>
            {filter}
          </Select.Option>
        ))}
    </Select>
  );
}
