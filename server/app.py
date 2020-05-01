from flask import Flask
import newspaper
from flask import jsonify

from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api")
def index():

    url = "https://www.cnn.com/2020/04/30/politics/trump-intelligence-community-china-coronavirus-origins/index.html"
    article = newspaper.Article(url)

    article.download()
    article.parse()

    data = {"title": article.title, "text": article.text}

    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)
