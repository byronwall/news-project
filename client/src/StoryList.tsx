import React from "react";
import { Link } from "react-router-dom";

import { timeSince } from "./helpers";
import { getReadStoryList } from "./localStorage";
import _ from "lodash";

interface StoryListProps {
  stories: Story[];
}

export interface Story {
  title: string;
  text: string;
  url: string;
  id: string;
  date: any;
}

export class StoryList extends React.Component<StoryListProps, {}> {
  constructor(props: StoryListProps) {
    super(props);
  }
  componentDidMount() {}
  render() {
    if (this.props.stories.length === 0) {
      return <div>refresh stories or add a feed to get started</div>;
    }

    const readStories = getReadStoryList();

    console.log("read stories", readStories);

    return (
      <div>
        <div>
          {this.props.stories.map((story) => {
            const isReadStory = readStories[story.url];
            return (
              <div
                style={{ display: "flex", alignItems: "center" }}
                key={story.url}
              >
                <img
                  src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${story.url}`}
                  style={{ flexGrow: 0 }}
                />
                <p key={story.url}>
                  <Link
                    to={`/story/${encodeURIComponent(story.url)}`}
                    style={{ color: isReadStory ? "#686868" : undefined }}
                  >
                    <b>{story.title}</b>
                    <span> {timeSince(story.date)}</span>
                  </Link>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
