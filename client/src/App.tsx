import "./App.css";

import { Button, Card, Popover, Position } from "@blueprintjs/core";
import React, { ReactNode } from "react";
import { Link, Route, Switch } from "react-router-dom";

import { AddFeed } from "./AddFeed";
import {
  createDefaultReaderSettings,
  ReaderSettings,
  ReaderSettingsOverlay,
} from "./ReaderSettings";
import { StoryComp } from "./Story";
import { StoryList } from "./StoryList";

interface AppState {
  readerSettings: ReaderSettings;
}

export class App extends React.Component<{}, AppState> {
  storyList: React.RefObject<StoryList>;

  constructor(props: {}) {
    super(props);

    this.storyList = React.createRef();

    this.state = { readerSettings: createDefaultReaderSettings() };
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

interface NavigationProps {
  refreshButton: ReactNode;
  onNewSettings(newSettings: ReaderSettings): void;
}

export class Navigation extends React.Component<NavigationProps> {
  render() {
    return (
      <div id="nav">
        <Link to="/">
          <img src="/android-chrome-192x192.png" height={32} width={32} />
        </Link>

        {this.props.refreshButton}

        <Popover position={Position.RIGHT}>
          <Button icon="cog" minimal />
          <Card>
            <ReaderSettingsOverlay onNewSettings={this.props.onNewSettings} />
            <AddFeed />
          </Card>
        </Popover>
      </div>
    );
  }
}
