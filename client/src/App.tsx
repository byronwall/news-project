import "./App.css";

import { Button } from "@blueprintjs/core";
import React, { ReactNode } from "react";
import { Route, Switch } from "react-router-dom";

import {
  createDefaultReaderSettings,
  ReaderSettings,
  getCurrentReaderSettings,
} from "./ReaderSettings";
import { StoryComp } from "./Story";
import { StoryList } from "./StoryList";
import { Navigation } from "./Navigation";

interface AppState {
  readerSettings: ReaderSettings;
}

export class App extends React.Component<{}, AppState> {
  storyList: React.RefObject<StoryList>;

  constructor(props: {}) {
    super(props);

    this.storyList = React.createRef();

    this.state = { readerSettings: getCurrentReaderSettings() };
  }

  refreshFeedContents() {
    if (this.storyList.current === null) {
      console.error("no story list");
      return;
    }

    this.storyList.current.refreshFeedContents();
  }

  render() {
    return (
      <div className="main">
        <Navigation
          refreshButton={
            <Button
              icon="refresh"
              onClick={() => this.refreshFeedContents()}
              intent="primary"
              minimal
            />
          }
          onNewSettings={(newSettings) =>
            this.setState({ readerSettings: newSettings })
          }
        />
        <Switch>
          <Route
            path="/story/:id"
            render={(props) => (
              <StoryComp
                {...props}
                readerSettings={this.state.readerSettings}
              />
            )}
          />
          <Route path="/">
            <StoryList ref={this.storyList} />
          </Route>
        </Switch>
      </div>
    );
  }
}
