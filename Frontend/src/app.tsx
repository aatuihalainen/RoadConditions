import Timeline from "./pages/timeline.tsx";
import React from "react";
import type { TimelineEvent } from "./types/types.ts";

const events: TimelineEvent[] = [
  { date: "2023-01-01", title: "Project Started", description: "Initial setup" },
  { date: "2023-03-15", title: "First Milestone", description: "Completed UI design" },
  { date: "2023-06-20", title: "Launch", description: "Website went live" },
];

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Project Timeline</h1>
      <Timeline events={events} />
    </div>
  );
};

export default App;