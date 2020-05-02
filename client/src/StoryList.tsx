import { Button, H2 } from "@blueprintjs/core";
import React from "react";

import { axiosInst } from ".";
import { Link } from "react-router-dom";

interface StoryListState {
  stories: Story[];
}

export interface Story {
  title: string;
  text: string;
  url: string;
  id: string;
}

export class StoryList extends React.Component<{}, StoryListState> {
  constructor(props: {}) {
    super(props);

    this.state = { stories: [] };
  }
  componentDidMount() {
    this.refreshStories();
  }
  render() {
    return (
      <div>
        <H2>story list</H2>
        <Button
          text="refresh stories"
          icon="refresh"
          onClick={() => this.refreshStories()}
        />
        <Button
          text="refresh feed content"
          onClick={() => this.refreshFeedContents()}
        />

        <div>
          {this.state.stories.map((story) => (
            <p key={story.url}>
              <Link to={`/story/${story.id}`}>
                <b>{story.title}</b>
                <br />
                {story.url}|{story.id}
              </Link>
            </p>
          ))}
        </div>
      </div>
    );
  }
  async refreshFeedContents() {
    const feedRes = await axiosInst.post("/api/feed_update", {});

    console.log(feedRes);

    // it's back, update stories

    this.refreshStories();
  }
  async refreshStories() {
    const storyRes = await axiosInst.get("/api/stories");

    console.log("stories", storyRes);

    const stories = storyRes.data as Story[];

    this.setState({ stories });
  }
}
