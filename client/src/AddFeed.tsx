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

const FEED_STORAGE_NAME = "FEED_LIST";
export class AddFeed extends React.Component<{}, AddFeedState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      url: "",
      allFeeds: [],
    };
  }

  componentDidMount() {
    this.loadFeedsFromLocalStorage();
  }

  loadFeedsFromLocalStorage() {
    const items = getCurrentFeeds();
    this.setState({ allFeeds: items });
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
    const newFeeds = this.state.allFeeds.filter((f) => f.url !== feed.url);

    this.saveAndUpdateState(newFeeds);
  }
  async addFeedUrl() {
    // need to post out

    const newFeedsList = this.state.allFeeds.concat({ url: this.state.url });

    this.saveAndUpdateState(newFeedsList);
  }

  private saveAndUpdateState(newFeedsList: Feed[]) {
    localStorage.setItem(FEED_STORAGE_NAME, JSON.stringify(newFeedsList));
    this.setState({ allFeeds: newFeedsList });
  }
}

export function getCurrentFeeds() {
  const _items = localStorage.getItem(FEED_STORAGE_NAME);

  if (_items === null) {
    return [];
  }

  //http://feeds.foxnews.com/foxnews/latest

  // http://rss.cnn.com/rss/cnn_topstories.rss

  const items = JSON.parse(_items) as Feed[];
  return items;
}
