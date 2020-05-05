import { Button, H2, H3, InputGroup } from "@blueprintjs/core";
import { handleStringChange } from "@blueprintjs/docs-theme";
import React from "react";
import _ from "lodash";

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
    const quickFeeds = {
      CNN: "http://rss.cnn.com/rss/cnn_topstories.rss",
      "Fox News": "http://feeds.foxnews.com/foxnews/latest",
      Reuters: "http://feeds.reuters.com/reuters/topNews",
      Economist: "https://www.economist.com/united-states/rss.xml",
      Reddit: "https://www.reddit.com/r/worldnews/.rss",
      BuzzFeed: "https://www.buzzfeed.com/world.xml",
      "Al Jazeera": "http://www.aljazeera.com/xml/rss/all.xml",
      Guardian: "https://www.theguardian.com/world/rss",
      "Washington Post": "http://feeds.washingtonpost.com/rss/world",
      NPR: "http://www.npr.org/rss/rss.php?id=1004",
      Vox: "https://www.vox.com/rss/world/index.xml",
      CBC: "http://www.cbc.ca/cmlink/rss-world",
      "LA Times": "https://www.latimes.com/world/rss2.0.xml",
      "Indy Star": "http://rssfeeds.indystar.com/indystar/todaystopstories",
      Breitbart: "http://feeds.feedburner.com/breitbart",
      Politico: "http://www.politico.com/rss/politicopicks.xml",
      "Drudge Report": "https://feedpress.me/drudgereportfeed",
    };

    return (
      <div>
        <H2>feed settings</H2>
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
        <div className="flex" style={{ flexWrap: "wrap" }}>
          <b>quick add</b>

          <Button
            text="add all"
            intent="primary"
            onClick={() => this.addFeedsUrl(Object.values(quickFeeds))}
          />

          {_.map(quickFeeds, (url, site) => (
            <Button
              key={site}
              text={site}
              onClick={() => this.addFeedUrl(url)}
              minimal
            />
          ))}
        </div>
        <div>
          <H3>all feeds</H3>
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

  deleteFeed(feed: Feed) {
    const newFeeds = this.state.allFeeds.filter((f) => f.url !== feed.url);

    this.saveAndUpdateState(newFeeds);
  }
  addFeedUrl(url = this.state.url) {
    // need to post out
    const newFeedsList = this.state.allFeeds.concat({ url });

    this.saveAndUpdateState(newFeedsList);
  }

  addFeedsUrl(urls: string[]) {
    // need to post out
    const newFeedsList = this.state.allFeeds.concat(
      urls.map((c) => ({ url: c }))
    );

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
