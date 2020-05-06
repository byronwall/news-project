const LOCAL_READ_STORIES = "STORIES_READ";
export function getReadStoryList() {
  const _item = localStorage.getItem(LOCAL_READ_STORIES);
  if (_item === null) {
    return {};
  }
  const readStories = JSON.parse(_item);

  return readStories;
}

export function addStoryToReadList(url: string) {
  const allStories = getReadStoryList();

  const newVal = allStories[url] ?? 0;
  allStories[url] = newVal + 1;

  localStorage.setItem(LOCAL_READ_STORIES, JSON.stringify(allStories));
}
