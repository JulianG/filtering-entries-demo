import * as React from "react";
import { render } from "react-dom";
import * as faker from "faker";
import { Entry, EntryList } from "./EntryList";
import "antd/dist/antd.css";

const entries: Entry[] = new Array(200).fill(0).map((e, i) => ({
  id: i,
  name: faker.name.firstName() + " " + faker.name.lastName(),
  color: getRandomColor(),
  job: faker.name.jobType(),
  age: Math.floor(Math.random() * 4) * 8 + 18
}));

function App() {
  return (
    <div className="App">
      <EntryList list={entries} />
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);

function getRandomColor(): string {
  const allColors = ["red", "orange", "gold", "green", "blue"];
  return allColors[faker.random.number(allColors.length - 1)];
}
