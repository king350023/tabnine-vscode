/* eslint-disable no-underscore-dangle */
import { ExtensionContext, StatusBarItem } from "vscode";
import { getPersistedAlphaVersion } from "../alphaInstaller";
import { ServiceLevel } from "../binary/state";
import { Capability, isCapabilityEnabled } from "../capabilities";
import {
  FULL_BRAND_REPRESENTATION,
  STATUS_BAR_FIRST_TIME_CLICKED,
} from "../consts";

export default class StatusBarData {
  private _serviceLevel?: ServiceLevel | undefined;

  private _icon?: string;

  private _text?: string;

  constructor(
    private _statusBarItem: StatusBarItem,
    private _context: ExtensionContext
  ) {}

  public set serviceLevel(serviceLevel: ServiceLevel | undefined) {
    this._serviceLevel = serviceLevel;
    this.updateStatusBar();
  }

  public get serviceLevel(): ServiceLevel | undefined {
    return this._serviceLevel;
  }

  public set icon(icon: string | undefined | null) {
    this._icon = icon || undefined;
    this.updateStatusBar();
  }

  public get icon(): string | undefined | null {
    return this._icon;
  }

  public set text(text: string | undefined | null) {
    this._text = text || undefined;
    this.updateStatusBar();
  }

  public get text(): string | undefined | null {
    return this._text;
  }

  private updateStatusBar() {
    const issueText = this._text ? `: ${this._text}` : "";
    const serviceLevel =
      this._serviceLevel === "Pro" || this._serviceLevel === "Trial"
        ? " pro"
        : "";

    this._statusBarItem.text = `${FULL_BRAND_REPRESENTATION}${serviceLevel}${this.getIconText()}${issueText.trimEnd()}`;
    this._statusBarItem.tooltip =
      isCapabilityEnabled(Capability.SHOW_AGRESSIVE_STATUS_BAR_UNTIL_CLICKED) &&
      !this._context.globalState.get(STATUS_BAR_FIRST_TIME_CLICKED)
        ? "Click ‘tabnine’ for installation information and configuration options"
        : `${FULL_BRAND_REPRESENTATION} (Click to open settings)${
            getPersistedAlphaVersion(this._context) ?? ""
          }`;
  }

  private getIconText(): string {
    if (this._icon) {
      return ` ${this._icon}`;
    }

    if (
      isCapabilityEnabled(Capability.SHOW_AGRESSIVE_STATUS_BAR_UNTIL_CLICKED) &&
      !this._context.globalState.get(STATUS_BAR_FIRST_TIME_CLICKED)
    ) {
      return " 👈";
    }

    return "";
  }
}
