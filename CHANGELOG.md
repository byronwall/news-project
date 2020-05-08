# Changelog

## 1.0.3 - 2020-05-07 22:44:12

- Open links from the StoryList on their on tab - avoid scrolling issues for now
- Add support for caching of reed results - save for 10 minutes
- Add support for caching of story data - save for 1 hour

## 1.0.3 - 2020-05-06 23:08:15

- Ensure only unique feeds are saved
- Switch to `localforage` for local saving and use async/await. Should allow larger saves on mobile.

## 1.0.2 - 2020-05-05 22:06:34

- Wrap a try/catch around article parsing error to prevent server hanging
- Force word wrap on story text to prevent long URL affecting page width
- Add a spinner to the refresh button when loading story list
- Align refresh icon to right edge when in mobile view -- easier single hand access
- Add indicator to track stories that were read

## 1.0.1 - 2020-05-04 22:33:04

- Add support for returning the date published and sorting by that
- Ensure `ReaderSettings` are loaded at App construction

## 1.0.0 - 2020-05-03 23:30:49

- Clean up visuals - add fixed buttons for options and back to home
- Add reader settings to control font size
- Add quick add buttons for CNN and Fox News
