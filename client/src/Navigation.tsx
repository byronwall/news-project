import { Button, Card, Popover, Position, Spinner } from "@blueprintjs/core";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

import { AddFeed } from "./AddFeed";
import { ReaderSettings, ReaderSettingsOverlay } from "./ReaderSettings";
import { LOADING_STATE } from "./App";

interface NavigationProps {
  loadingState: LOADING_STATE;

  onNewSettings(newSettings: ReaderSettings): void;
  onRefreshCommand(): void;
}

export class Navigation extends React.Component<NavigationProps> {
  render() {
    return (
      <div id="nav">
        <Link to="/">
          <img src="/logo192.png" height={32} width={32} />
        </Link>

        <Popover position={Position.RIGHT}>
          <Button icon="cog" minimal />
          <Card
            style={{ maxWidth: "80vw", maxHeight: "80vh", overflow: "auto" }}
          >
            <ReaderSettingsOverlay onNewSettings={this.props.onNewSettings} />
            <AddFeed />
          </Card>
        </Popover>

        <div id="refresh">
          {this.props.loadingState === LOADING_STATE.LOADED ? (
            <Button
              icon="refresh"
              onClick={this.props.onRefreshCommand}
              intent="primary"
              minimal
            />
          ) : (
            <Spinner size={30} />
          )}
        </div>
      </div>
    );
  }
}
