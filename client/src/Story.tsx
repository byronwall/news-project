import React from "react";
import { H2, H3 } from "@blueprintjs/core";
import { RouteComponentProps } from "react-router-dom";
import { axiosInst } from ".";
import { Story } from "./StoryList";

interface StoryParams {
  id: string;
}

interface _StoryProps {}

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
            <H3>{this.state.loadedStory.title}</H3>

            {this.state.loadedStory?.text.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </>
        )}
      </div>
    );
  }
}
