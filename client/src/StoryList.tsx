import { Button, H2 } from "@blueprintjs/core";
import React from "react";

import { axiosInst } from ".";
import { Link } from "react-router-dom";
import { getCurrentFeeds, AddFeed } from "./AddFeed";

interface StoryListState {
  stories: Story[];
}

export interface Story {
  title: string;
  text: string;
  url: string;
  id: string;
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
    const stories = JSON.parse(_stories);

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

  private saveAndUpdateState(stories: any) {
    localStorage.setItem(LOCAL_STORIES, JSON.stringify(stories));
    this.setState({ stories });
  }
}
