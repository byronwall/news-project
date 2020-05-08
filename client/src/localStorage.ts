import localforage from "localforage";

export type ReadStoryHash = { [url: string]: number };

const LOCAL_READ_STORIES = "STORIES_READ";
export async function getReadStoryList() {
  try {
    const readStories = await localforage.getItem<ReadStoryHash>(
      LOCAL_READ_STORIES
    );
    if (readStories === null) {
      return {};
    }

    return readStories;
  } catch {
    return {};
  }
}

export async function addStoryToReadList(url: string) {
  const allStories = await getReadStoryList();

  const newVal = allStories[url] ?? 0;
  allStories[url] = newVal + 1;

  localforage.setItem(LOCAL_READ_STORIES, allStories);
}
