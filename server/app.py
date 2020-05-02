from flask import Flask, request
import newspaper
from flask import jsonify

from flask_cors import CORS

from tinydb import TinyDB, Query

from datetime import datetime
import feedparser


def ticks():
    return (datetime.now() - datetime(1, 1, 1)).total_seconds() * 10000000


app = Flask(__name__)
CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"


db_feeds = TinyDB("feeds.json")
db_stories = TinyDB("stories.json")


@app.route("/api/story/<id>")
def index(id):

    print("get story", id)
    # this needs to return X stories

    Story = Query()

    item = db_stories.search(Story.id == id)

    print("match?", item)
    url = item[0]["url"]
    article = newspaper.Article(url)

    article.download()
    article.parse()

    data = {"title": article.title, "text": article.text, "url": url, "id": id}

    return jsonify(data)


@app.route("/api/stories")
def stories():

    # this needs to return X stories

    data = db_stories.all()

    return jsonify(data)


@app.route("/api/feeds")
def get_feeds():
    print("get feeds")

    feed = db_feeds.all()

    return jsonify(feed)


@app.route("/api/add_feed", methods=["POST"])
def add_feed():

    print("add feed", request.json)

    url = request.json["url"]

    db_feeds.insert({"url": url})

    # build some links and add to database

    # process a set of RSS feeds

    return jsonify({"result": True})


@app.route("/api/delete_feed", methods=["POST"])
def delete_feed():

    print("delete feed", request.json)

    url = request.json["url"]

    Feed = Query()

    db_feeds.remove(Feed.url == url)

    # build some links and add to database

    # process a set of RSS feeds

    return jsonify({"result": True})


@app.route("/api/feed_update", methods=["POST"])
def update():

    # build some links and add to database

    # process a set of RSS feeds

    # get all of the feeds

    db_stories.purge()

    all_feeds = db_feeds.all()

    for feed in all_feeds:
        print("process feed", feed)
        d = feedparser.parse(feed["url"])

        for entry in d.entries:
            print("process entry", entry)
            db_stories.insert(
                {"url": entry.link, "title": entry.title, "id": str(ticks())}
            )

    return jsonify({"result": True})


if __name__ == "__main__":
    app.run(debug=True)
