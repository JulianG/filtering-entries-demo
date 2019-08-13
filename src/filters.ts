import * as React from "react";

export type FilterState<E> = { [P in keyof E]?: Array<string> };

type FilterAction<E> = {
  type: "add" | "remove";
  property: keyof E;
  value: string;
};

type Reducer<S, A> = (prevState: S, action: A) => S;

type FilterReducer<E> = Reducer<FilterState<E>, FilterAction<E>>;

const filtersReducer = <E>(
  prevState: FilterState<E>,
  action: FilterAction<E>
): FilterState<E> => {
  const state = { ...prevState };
  const arr = state[action.property] as Array<any>;

  console.log(JSON.stringify(action));

  switch (action.type) {
    case "add":
      state[action.property] = [...arr, action.value];
      break;
    case "remove":
      const index = arr.indexOf(action.value);
      if (index >= 0) {
        arr.splice(index, 1);
        break;
      }
    default:
  }
  return state;
};

type ActionCreator<E> = (
  actionType: "add" | "remove",
  property: keyof E
) => (value: string) => void;

export const useFilters = <E>(
  initialFilters: FilterState<E>
): [FilterState<E>, ActionCreator<E>] => {
  const [filters, dispatch] = React.useReducer<FilterReducer<E>>(
    filtersReducer,
    initialFilters
  );

  const createAction = (
    actionType: "add" | "remove",
    property: keyof FilterState<E>
  ) => (value: string) => dispatch({ type: actionType, property, value });

  return [filters, createAction];
};

export function isEntryMatchingFilters<E, P extends keyof E>(
  filters: FilterState<E>,
  property: P,
  entry: E
) {
  const arr = filters[property];
  const entryProperty: string = ((entry[
    property
  ] as unknown) as string).toString();
  return arr ? (arr.length ? arr.indexOf(entryProperty) >= 0 : true) : true;
}
