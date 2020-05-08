import "./App.css";

import _ from "lodash";
import React from "react";
import { Route, Switch } from "react-router-dom";

import { axiosInst } from ".";
import { getCurrentFeeds } from "./AddFeed";
import { Navigation } from "./Navigation";
import {
  getCurrentReaderSettings,
  ReaderSettings,
  createDefaultReaderSettings,
} from "./ReaderSettings";
import { StoryComp } from "./Story";
import { Story, StoryList } from "./StoryList";
import localforage from "localforage";

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
      readerSettings: createDefaultReaderSettings(),
      stories: [],
      loadingState: LOADING_STATE.LOADED,
    };
  }

  async componentDidMount() {
    const stories = await getSavedStoryList();
    this.setState({ stories });

    const readerSettings = await getCurrentReaderSettings();
    this.setState({ readerSettings });
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
    this.setState({ loadingState: LOADING_STATE.LOADING });
    const feeds = await getCurrentFeeds();

    const feedRes = await axiosInst.post("/api/feed_update", { feeds });

    console.log(feedRes);

    // it's back, update stories

    const stories = feedRes.data;

    this.setState({ loadingState: LOADING_STATE.LOADED });
    this.saveAndUpdateState(stories);
  }

  private saveAndUpdateState(stories: Story[]) {
    const storiesSorted = _.sortBy(stories, (c) => -c.date);

    this.setState({ stories: storiesSorted });
    localforage.setItem(LOCAL_STORIES, storiesSorted);
  }
}

const LOCAL_STORIES = "STORIES";
async function getSavedStoryList() {
  try {
    const stories = await localforage.getItem<Story[]>(LOCAL_STORIES);

    if (stories === null) {
      return [];
    }

    return stories;
  } catch {
    return [];
  }
}
