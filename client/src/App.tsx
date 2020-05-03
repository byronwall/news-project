import "./App.css";

import React from "react";
import { AddFeed } from "./AddFeed";
import { StoryList } from "./StoryList";
import { Switch, Route } from "react-router-dom";
import { StoryComp } from "./Story";

export class App extends React.Component {
  render() {
    return (
      <div className="main">
        <Switch>
          <Route path="/story/:id" component={StoryComp} />
          <Route path="/">
            <AddFeed />
            <StoryList />
          </Route>
        </Switch>
      </div>
    );
  }
}
