import * as React from "react";
import { List, Tag, Col, Row, Card } from "antd";
import { Typography } from "antd";
import { TagFilter, FilterPredicate } from "./GenericFilter";
import { useFilters, isEntryMatchingFilters } from "./filters";

export type Entry = {
  id: number;
  name: string;
  color: string;
  job: string;
  age: number;
};

type Props = {
  list: Entry[];
};

export const EntryList: React.FC<Props> = ({ list }) => {

  const [filters, createFilterAction] = useFilters<Entry>({
    color: new Array<string>(),
    job: new Array<string>(),
    age: new Array<string>()
  });

  const filteredList = list.filter(entry => (
    isEntryMatchingFilters(filters, 'color', entry)
    && isEntryMatchingFilters(filters, 'job', entry)
    && isEntryMatchingFilters(filters, 'age', entry)
  ));

  const tags = React.useMemo(
    () => ({
      job: new Set(list.map(entry => entry.job).sort()),
      color: new Set(list.map(entry => entry.color).sort()),
      age: new Set(list.map(entry => entry.age.toString()).sort())
    }),
    [list]
  );

  return (
    <Card>
      <Typography.Title level={2}>Search Results</Typography.Title>
      <Row>
        <Col span={8}>
          <TagFilter
            tags={tags.job}
            value={filters.job!}
            property="job"
            onAdd={createFilterAction("add", "job")}
            onRemove={createFilterAction("remove", "job")}
          />
        </Col>
        <Col span={8}>
          <TagFilter
            tags={tags.color}
            value={filters.color!}
            property="color"
            onAdd={createFilterAction("add", "color")}
            onRemove={createFilterAction("remove", "color")}
          />
        </Col>
        <Col span={8}>
          <TagFilter
            tags={tags.age}
            value={filters.age!.map(a => a.toString())}
            property="age"
            onAdd={createFilterAction("add", "age")}
            onRemove={createFilterAction("remove", "age")}
          />
        </Col>
      </Row>
      <List
        bordered={false}
        dataSource={filteredList}
        renderItem={entry => (
          <List.Item key={entry.id}>
            {entry.name} ({entry.age})
            <Tag
              style={{ cursor: 'pointer' }}
              onClick={() => createFilterAction("add", "job")(entry.job)}
            >{entry.job}</Tag>
            <Tag
              color={entry.color}
              style={{ cursor: 'pointer' }}
              onClick={() => createFilterAction("add", "color")(entry.color)}
            >{entry.color}</Tag>
          </List.Item>
        )}
      />
    </Card>
  );
};

//////////////

function useCombinedFilters<T>(
  numFilters: number
): [FilterPredicate<T>, ...Array<(predicate: FilterPredicate<T>) => void>] {
  const [predicates, setAllPredicates] = React.useState(() =>
    new Array(numFilters).fill((a: T) => true)
  );

  const setFilterPredicate = (index: number) => (
    predicate: FilterPredicate<T>
  ) => {
    setAllPredicates(() => {
      const ff = [...predicates];
      ff[index] = predicate;
      return ff;
    });
  };

  const combinedFilterFunction = (entry: T) =>
    predicates.every(ff => ff(entry));

  const setters = predicates.map((ff, i) => setFilterPredicate(i));

  return [combinedFilterFunction, ...setters];
}
