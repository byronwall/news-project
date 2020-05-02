import { Button, H2, InputGroup } from "@blueprintjs/core";
import { handleStringChange } from "@blueprintjs/docs-theme";
import React from "react";

import { axiosInst } from ".";

interface AddFeedState {
  url: string;

  allFeeds: Feed[];
}

interface Feed {
  url: string;
}

export class AddFeed extends React.Component<{}, AddFeedState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      url: "",
      allFeeds: [],
    };
  }

  async componentDidMount() {
    await this.updateFeeds();
  }

  private async updateFeeds() {
    const feeds = await axiosInst.get("/api/feeds");
    console.log("feeds", feeds);
    this.setState({ allFeeds: feeds.data });
  }

  render() {
    return (
      <div>
        <div className="flex">
          <b>add feed</b>
          <InputGroup
            placeholder="feed url"
            value={this.state.url}
            onChange={handleStringChange((newUrl) =>
              this.setState({ url: newUrl })
            )}
          />
          <Button
            onClick={() => this.addFeedUrl()}
            text="add feed"
            icon="plus"
            intent="primary"
          />
        </div>
        <div>
          <H2>all feeds</H2>
          {this.state.allFeeds.map((feed) => (
            <p key={feed.url}>
              <Button
                icon="cross"
                minimal
                onClick={() => this.deleteFeed(feed)}
                intent="danger"
              />
              {feed.url}
            </p>
          ))}
        </div>
      </div>
    );
  }
  async deleteFeed(feed: Feed) {
    console.log("delete feed");

    const result = await axiosInst.post("/api/delete_feed", feed);

    console.log("delete result", result);

    this.updateFeeds();
  }
  async addFeedUrl() {
    // need to post out
    console.log("post to server");

    const result = await axiosInst.post("/api/add_feed", {
      url: this.state.url,
    });
    console.log("result", result);

    this.updateFeeds();
  }
}
