from flask import Flask, request
import newspaper
from flask import jsonify

from flask_cors import CORS


from datetime import datetime
import feedparser
import urllib.parse
import time
import calendar

from cachetools import TTLCache

story_data_cache = TTLCache(maxsize=100, ttl=3600)  # stories last for 1 hour
feed_data_cache = TTLCache(maxsize=100, ttl=600)  # feeds are stored for 10 minutes


def ticks():
    return (datetime.now() - datetime(1, 1, 1)).total_seconds() * 10000000


app = Flask(__name__, static_url_path="")
CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"

# https%3A%2F%2Fwww.buzzfeednews.com%2Farticle%2Fkarlazabludovsky%2Fcoronavirus-ecuador-guayaquil


@app.route("/")
@app.route("/story/<path:url>")
def root(url=""):
    return app.send_static_file("index.html")


@app.route("/api/story", methods=["POST"])
def story():
    print("made it here")
    # this needs to return X stories

    url = request.json["url"]
    url = urllib.parse.unquote(url)

    # attempt to hit the cache first

    try:
        cached_story = story_data_cache[url]
        cached_story["is_cached"] = True
        return jsonify(cached_story)

    except:

        print("get story", url)
        article = newspaper.Article(url)

        data = {"title": "error"}

        # will sometimes get an error on the download step, need to ignore
        try:
            article.download()
            article.parse()

            data = {
                "title": article.title,
                "text": article.text,
                "url": url,
            }

            story_data_cache[url] = data

        except:
            print("error processing page", url, flush=True)
            pass

        return jsonify(data)


@app.route("/api/feed_update", methods=["POST"])
def update():

    all_feeds = request.json["feeds"]

    # build some links and add to database

    # process a set of RSS feeds

    # get all of the feeds

    all_stories = []

    for feed in all_feeds:

        url = feed["url"]

        # attempt to load story list from cache
        try:
            cached_feed_list = feed_data_cache[url]

            all_stories = all_stories + cached_feed_list
            print("cache hit", url, flush=True)

        except:

            d = feedparser.parse(url)

            feed_stories = []

            for entry in d.entries:

                # print(entry.keys())

                timestamp = entry.get("published_parsed")
                raw_timestamp = timestamp

                if timestamp is None:
                    timestamp = 0
                else:
                    timestamp = calendar.timegm(timestamp)

                feed_result = {
                    "url": entry.link,
                    "title": entry.title,
                    "id": str(ticks()),
                    "date": timestamp,
                    "raw_date": raw_timestamp,
                    "raw_data": entry,
                }

                feed_stories.append(feed_result)

            feed_data_cache[url] = feed_stories
            all_stories = all_stories + feed_stories

    return jsonify(all_stories)


def datetime_from_utc_to_local(utc_datetime):
    now_timestamp = time.time()
    offset = datetime.fromtimestamp(now_timestamp) - datetime.utcfromtimestamp(
        now_timestamp
    )
    return utc_datetime + offset


if __name__ == "__main__":
    app.run(debug=True)
