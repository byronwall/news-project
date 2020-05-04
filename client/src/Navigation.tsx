import { Button, Card, Popover, Position } from "@blueprintjs/core";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

import { AddFeed } from "./AddFeed";
import { ReaderSettings, ReaderSettingsOverlay } from "./ReaderSettings";

interface NavigationProps {
  refreshButton: ReactNode;
  onNewSettings(newSettings: ReaderSettings): void;
}

export class Navigation extends React.Component<NavigationProps> {
  render() {
    return (
      <div id="nav">
        <Link to="/">
          <img src="/logo192.png" height={32} width={32} />
        </Link>

        {this.props.refreshButton}

        <Popover position={Position.RIGHT}>
          <Button icon="cog" minimal />
          <Card>
            <ReaderSettingsOverlay onNewSettings={this.props.onNewSettings} />
            <AddFeed />
          </Card>
        </Popover>
      </div>
    );
  }
}
