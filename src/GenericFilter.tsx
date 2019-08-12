import * as React from "react";
import { Select } from "antd";

type Has<P extends string, S> = { [Q in P]: S };

export type FilterPredicate<E> = (entry: E, index: number, arr: E[]) => boolean;

type Props<E, P> = {
  list: E[];
  property: P;
  onChange: (predicate: FilterPredicate<E>) => void;
};

export function TagFilter<
  E extends Has<P, T>,
  P extends string,
  T extends string | number
>(props: Props<E, P>) {
  const { list, property, onChange } = props;

  const filters = React.useMemo(
    () => Array.from(new Set(list.map(entry => entry[property]).sort())),
    [list, property]
  );

  const onOptionsChange = (selectedTags: T[]) => {
    const predicate = (entry: E) =>
      selectedTags.length === 0 || selectedTags.indexOf(entry[property]) > -1;
    onChange(predicate);
  };

  return (
    <Select
      style={{ width: "100%" }}
      mode="multiple"
      placeholder={`filter by ${property}...`}
      allowClear={true}
      defaultValue={new Array<T>()}
      onChange={onOptionsChange}
    >
      {filters.map(filter => (
        <Select.Option key={filter.toString()} value={filter}>
          {filter}
        </Select.Option>
      ))}
    </Select>
  );
}
