import * as React from "react";
import { List, Tag, Col, Row, Card } from "antd";
import { Typography } from "antd";
import { TagFilter, FilterPredicate } from "./GenericFilter";

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
  //
  // we may want to keep a list of tags outside of the <Filters>
  // component, so that we can add filter tags by clicking
  // on the list items themselves?
  //
  const [
    filterFunctionPredicate,
    setColorFilter,
    setJobFilter,
    setAgeFilter
  ] = useCombinedFilters<Entry>(3);

  const filteredList = list.filter(filterFunctionPredicate);

  return (
    <Card>
      <Typography.Title level={2}>Search Results</Typography.Title>
      <Row>
        <Col span={8}>
          <TagFilter list={list} property="job" onChange={setJobFilter} />
        </Col>
        <Col span={8}>
          <TagFilter list={list} property="color" onChange={setColorFilter} />
        </Col>
        <Col span={8}>
          <TagFilter list={list} property="age" onChange={setAgeFilter} />
        </Col>
      </Row>
      <List
        bordered={false}
        dataSource={filteredList}
        renderItem={entry => (
          <List.Item key={entry.id}>
            {entry.name} ({entry.age}) <Tag>{entry.job}</Tag>
            <Tag color={entry.color}>{entry.color}</Tag>
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
