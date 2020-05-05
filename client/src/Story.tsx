import { H3, Icon } from "@blueprintjs/core";
import React from "react";
import { RouteComponentProps } from "react-router-dom";

import { axiosInst } from ".";
import { ReaderSettings } from "./ReaderSettings";
import { Story } from "./StoryList";

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

  async componentDidMount() {
    const id = this.props.match.params.id;

    const story = await axiosInst.post("/api/story", { url: id });

    console.log("stoyr res", story);

    this.setState({ loadedStory: story.data });
  }

  render() {
    console.log(this.props);
    return (
      <div>
        {this.state.loadedStory === undefined && <p>loading story...</p>}
        {this.state.loadedStory !== undefined && (
          <>
            <a
              href={decodeURIComponent(this.props.match.params.id)}
              target="blank"
            >
              <H3>{this.state.loadedStory.title}</H3>
            </a>

            {this.state.loadedStory?.text.split("\n").map((line, index) => (
              <p
                key={index}
                style={{ fontSize: this.props.readerSettings.fontSize }}
              >
                {line}
              </p>
            ))}
          </>
        )}
      </div>
    );
  }
}
