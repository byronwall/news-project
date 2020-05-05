from flask import Flask, request
import newspaper
from flask import jsonify

from flask_cors import CORS

from tinydb import TinyDB, Query

from datetime import datetime
import feedparser
import urllib.parse
import time
import calendar


def ticks():
    return (datetime.now() - datetime(1, 1, 1)).total_seconds() * 10000000


app = Flask(__name__, static_url_path="")
CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"


db_feeds = TinyDB("feeds.json")
db_stories = TinyDB("stories.json")


@app.route("/")
def root():
    return app.send_static_file("index.html")


@app.route("/api/story", methods=["POST"])
def story():
    print("made it here")
    # this needs to return X stories

    url = request.json["url"]
    url = urllib.parse.unquote(url)

    print("get story", url)
    article = newspaper.Article(url)

    article.download()
    article.parse()

    data = {"title": article.title, "text": article.text, "url": url}

    print("data", data)

    return jsonify(data)


@app.route("/api/stories")
def stories():

    # this needs to return X stories

    data = db_stories.all()

    return jsonify(data)


@app.route("/api/feed_update", methods=["POST"])
def update():

    all_feeds = request.json["feeds"]

    # build some links and add to database

    # process a set of RSS feeds

    # get all of the feeds

    all_stories = []

    for feed in all_feeds:

        d = feedparser.parse(feed["url"])

        for entry in d.entries:

            print(entry.keys())

            timestamp = entry.get("published_parsed")
            raw_timestamp = timestamp

            if timestamp is None:
                timestamp = 0
            else:
                timestamp = calendar.timegm(timestamp)

            all_stories.append(
                {
                    "url": entry.link,
                    "title": entry.title,
                    "id": str(ticks()),
                    "date": timestamp,
                    "raw_date": raw_timestamp,
                    "raw_data": entry
                }
            )

    return jsonify(all_stories)


def datetime_from_utc_to_local(utc_datetime):
    now_timestamp = time.time()
    offset = datetime.fromtimestamp(now_timestamp) - datetime.utcfromtimestamp(
        now_timestamp
    )
    return utc_datetime + offset


if __name__ == "__main__":
    app.run(debug=True)
