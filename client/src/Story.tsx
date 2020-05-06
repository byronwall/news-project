import { H3, Icon, Spinner } from "@blueprintjs/core";
import React from "react";
import { RouteComponentProps } from "react-router-dom";

import { axiosInst } from ".";
import { ReaderSettings } from "./ReaderSettings";
import { Story } from "./StoryList";
import { addStoryToReadList } from "./localStorage";

interface StoryParams {
  id: string;
}

interface _StoryProps {
  readerSettings: ReaderSettings;
}

interface StoryState {
  loadedStory: Story | undefined;
}

type StoryProps = RouteComponentProps<StoryParams> & _StoryProps;

export class StoryComp extends React.Component<StoryProps, StoryState> {
  constructor(props: StoryProps) {
    super(props);

    this.state = { loadedStory: undefined };
  }

  get storyUrl() {
    return this.props.match.params.id;
  }

  get storyUrlClean() {
    return decodeURIComponent(this.props.match.params.id);
  }

  async componentDidMount() {
    const id = this.storyUrl;

    const story = await axiosInst.post("/api/story", { url: id });

    console.log("stoyr res", story);

    this.setState({ loadedStory: story.data });

    // save this url to the read list
    addStoryToReadList(this.storyUrlClean);
  }

  render() {
    console.log(this.props);

    const storyUrl = decodeURIComponent(this.props.match.params.id);
    const titleText = this.state.loadedStory
      ? this.state.loadedStory.title
      : storyUrl;

    const storyText = this.state.loadedStory?.text ?? "";

    return (
      <div>
        <a href={storyUrl} target="blank">
          <H3>{titleText}</H3>
        </a>

        {this.state.loadedStory === undefined ? (
          <Spinner />
        ) : (
          <div style={{ wordWrap: "break-word" }}>
            {storyText.split("\n").map((line, index) => (
              <p
                key={index}
                style={{ fontSize: this.props.readerSettings.fontSize }}
              >
                {line}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  }
}
