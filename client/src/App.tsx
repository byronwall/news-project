import "./App.css";

import React from "react";

interface Article {
  title: string;
  text: string;
}
interface AppState {
  article: Article | undefined;
}
export class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      article: undefined,
    };
  }

  async componentDidMount() {
    const data = await fetch("http://localhost:5000/api");

    const article = ((await data.json()) as any) as Article;
    console.log("article", article);

    this.setState({ article });
  }
  render() {
    if (this.state.article === undefined) {
      return null;
    }

    return (
      <div>
        <h1>{this.state.article.title}</h1>
        {this.state.article.text.split("\n").map((item, i) => {
          return <p key={i}>{item}</p>;
        })}
      </div>
    );
  }
}
