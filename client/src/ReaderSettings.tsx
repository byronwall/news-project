import { Button, H2, Icon } from "@blueprintjs/core";
import _ from "lodash";
import React from "react";
import localforage from "localforage";

interface ReaderSettingsOverlayState {
  url: string;

  settings: ReaderSettings;
}

interface ReaderSettingsOverlayProps {
  onNewSettings(newSettings: ReaderSettings): void;
}

export interface ReaderSettings {
  fontSize: number;
}

export function createDefaultReaderSettings(): ReaderSettings {
  return {
    fontSize: 14,
  };
}

const STORAGE_READER_SETTINGS = "READER_SETTINGS";
const FONT_MIN_SIZE = 6;
const FONT_MAX_SIZE = 48;
export class ReaderSettingsOverlay extends React.Component<
  ReaderSettingsOverlayProps,
  ReaderSettingsOverlayState
> {
  constructor(props: ReaderSettingsOverlayProps) {
    super(props);

    this.state = {
      url: "",
      settings: createDefaultReaderSettings(),
    };
  }

  componentDidMount() {
    this.loadFeedsFromLocalStorage();
  }

  componentDidUpdate(
    prevProps: ReaderSettingsOverlayProps,
    prevState: ReaderSettingsOverlayState
  ) {
    const didSettingsChange = !_.isEqual(
      prevState.settings,
      this.state.settings
    );

    if (didSettingsChange) {
      this.props.onNewSettings(this.state.settings);
    }
  }

  async loadFeedsFromLocalStorage() {
    const items = await getCurrentReaderSettings();
    this.setState({ settings: items });
  }

  handleSettingChange<K extends keyof ReaderSettings>(
    key: K,
    value: ReaderSettings[K]
  ) {
    const newSettings = _.cloneDeep(this.state.settings);

    newSettings[key] = value;

    this.saveAndUpdateState(newSettings);
  }

  makeFontBigger() {
    const newSize = Math.min(this.state.settings.fontSize + 1, FONT_MAX_SIZE);

    this.handleSettingChange("fontSize", newSize);
  }

  makeFontSmaller() {
    const newSize = Math.max(this.state.settings.fontSize - 1, FONT_MIN_SIZE);

    this.handleSettingChange("fontSize", newSize);
  }

  render() {
    return (
      <div>
        <H2>reader settings</H2>

        <div className="flex">
          <Button
            text={
              <Icon
                icon="font"
                iconSize={16}
                onClick={() => this.makeFontSmaller()}
              />
            }
          />
          <Button
            text={
              <Icon
                icon="font"
                iconSize={32}
                onClick={() => this.makeFontBigger()}
              />
            }
          />
          <p>{this.state.settings.fontSize}</p>
        </div>
      </div>
    );
  }

  private saveAndUpdateState(newSettings: ReaderSettings) {
    this.setState({ settings: newSettings });
    localforage.setItem(STORAGE_READER_SETTINGS, newSettings);
  }
}

export async function getCurrentReaderSettings() {
  try {
    const _items = await localforage.getItem<ReaderSettings>(
      STORAGE_READER_SETTINGS
    );

    if (_items === null) {
      return createDefaultReaderSettings();
    }

    // _items can be null
    return _items;
  } catch {
    return createDefaultReaderSettings();
  }
}
