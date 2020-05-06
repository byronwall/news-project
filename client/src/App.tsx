import "./App.css";

import _ from "lodash";
import React from "react";
import { Route, Switch } from "react-router-dom";

import { axiosInst } from ".";
import { getCurrentFeeds } from "./AddFeed";
import { Navigation } from "./Navigation";
import { getCurrentReaderSettings, ReaderSettings } from "./ReaderSettings";
import { StoryComp } from "./Story";
import { Story, StoryList } from "./StoryList";

interface AppState {
  readerSettings: ReaderSettings;
  stories: Story[];
  loadingState: LOADING_STATE;
}

export enum LOADING_STATE {
  LOADED,
  LOADING,
  ERROR,
}

export class App extends React.Component<{}, AppState> {
  storyList: React.RefObject<StoryList>;

  constructor(props: {}) {
    super(props);

    this.storyList = React.createRef();

    this.state = {
      readerSettings: getCurrentReaderSettings(),
      stories: getSavedStoryList(),
      loadingState: LOADING_STATE.LOADED,
    };
  }

  render() {
    return (
      <div className="main">
        <Navigation
          loadingState={this.state.loadingState}
          onNewSettings={(newSettings) =>
            this.setState({ readerSettings: newSettings })
          }
          onRefreshCommand={() => this.refreshFeedContents()}
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
            <StoryList stories={this.state.stories} />
          </Route>
        </Switch>
      </div>
    );
  }

  async refreshFeedContents() {
    const feeds = getCurrentFeeds();

    this.setState({ loadingState: LOADING_STATE.LOADING });
    const feedRes = await axiosInst.post("/api/feed_update", { feeds });

    console.log(feedRes);

    // it's back, update stories

    const stories = feedRes.data;

    this.setState({ loadingState: LOADING_STATE.LOADED });
    this.saveAndUpdateState(stories);
  }

  private saveAndUpdateState(stories: Story[]) {
    const storiesSorted = _.sortBy(stories, (c) => -c.date);

    localStorage.setItem(LOCAL_STORIES, JSON.stringify(storiesSorted));

    this.setState({ stories: storiesSorted });
  }
}

const LOCAL_STORIES = "STORIES";
function getSavedStoryList() {
  const _stories = localStorage.getItem(LOCAL_STORIES);
  if (_stories === null) {
    return [];
  }

  // these will be sorted
  const stories = JSON.parse(_stories) as Story[];

  return stories;
}
