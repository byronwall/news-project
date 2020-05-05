import _ from "lodash";
import React from "react";
import { Link } from "react-router-dom";

import { axiosInst } from ".";
import { getCurrentFeeds } from "./AddFeed";
import { timeSince } from "./helpers";

interface StoryListState {
  stories: Story[];
}

export interface Story {
  title: string;
  text: string;
  url: string;
  id: string;
  date: any;
}

const LOCAL_STORIES = "STORIES";
export class StoryList extends React.Component<{}, StoryListState> {
  constructor(props: {}) {
    super(props);

    this.state = { stories: [] };
  }
  componentDidMount() {
    const _stories = localStorage.getItem(LOCAL_STORIES);
    if (_stories === null) {
      return;
    }

    // these will be sorted
    const stories = JSON.parse(_stories) as Story[];

    this.setState({ stories });
  }
  render() {
    if (this.state.stories.length === 0) {
      return <div>refresh stories or add a feed to get started</div>;
    }

    return (
      <div>
        <div>
          {this.state.stories.map((story) => (
            <div
              style={{ display: "flex", alignItems: "center" }}
              key={story.url}
            >
              <img
                src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${story.url}`}
                style={{ flexGrow: 0 }}
              />
              <p key={story.url}>
                <Link to={`/story/${encodeURIComponent(story.url)}`}>
                  <b>{story.title}</b>
                  <span> {timeSince(story.date)}</span>
                </Link>
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  async refreshFeedContents() {
    const feeds = getCurrentFeeds();

    const feedRes = await axiosInst.post("/api/feed_update", { feeds });

    console.log(feedRes);

    // it's back, update stories

    const stories = feedRes.data;

    this.saveAndUpdateState(stories);
  }

  private saveAndUpdateState(stories: Story[]) {
    const storiesSorted = _.sortBy(stories, (c) => -c.date);

    localStorage.setItem(LOCAL_STORIES, JSON.stringify(storiesSorted));

    this.setState({ stories: storiesSorted });
  }
}
