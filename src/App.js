import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3";

var oldOrder = [];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { wordFrequency: [] };
  }
  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  getWordFrequency = (text) => {
    const stopWords = new Set([
      "the",
      "and",
      "a",
      "an",
      "in",
      "on",
      "at",
      "for",
      "with",
      "about",
      "as",
      "by",
      "to",
      "of",
      "from",
      "that",
      "which",
      "who",
      "whom",
      "this",
      "these",
      "those",
      "it",
      "its",
      "they",
      "their",
      "them",
      "we",
      "our",
      "ours",
      "you",
      "your",
      "yours",
      "he",
      "him",
      "his",
      "she",
      "her",
      "hers",
      "it",
      "its",
      "we",
      "us",
      "our",
      "ours",
      "they",
      "them",
      "theirs",
      "I",
      "me",
      "my",
      "myself",
      "you",
      "your",
      "yourself",
      "yourselves",
      "was",
      "were",
      "is",
      "am",
      "are",
      "be",
      "been",
      "being",
      "have",
      "has",
      "had",
      "having",
      "do",
      "does",
      "did",
      "doing",
      "a",
      "an",
      "the",
      "as",
      "if",
      "each",
      "how",
      "which",
      "who",
      "whom",
      "what",
      "this",
      "these",
      "those",
      "that",
      "with",
      "without",
      "through",
      "over",
      "under",
      "above",
      "below",
      "between",
      "among",
      "during",
      "before",
      "after",
      "until",
      "while",
      "of",
      "for",
      "on",
      "off",
      "out",
      "in",
      "into",
      "by",
      "about",
      "against",
      "with",
      "amongst",
      "throughout",
      "despite",
      "towards",
      "upon",
      "isn't",
      "aren't",
      "wasn't",
      "weren't",
      "haven't",
      "hasn't",
      "hadn't",
      "doesn't",
      "didn't",
      "don't",
      "doesn't",
      "didn't",
      "won't",
      "wouldn't",
      "can't",
      "couldn't",
      "shouldn't",
      "mustn't",
      "needn't",
      "daren't",
      "hasn't",
      "haven't",
      "hadn't",
    ]);
    const words = text
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=_`~()]/g, "")
      .replace(/\s{2,}/g, " ")
      .split(" ");
    const filteredWords = words.filter((word) => !stopWords.has(word));
    return Object.entries(
      filteredWords.reduce((freq, word) => {
        freq[word] = (freq[word] || 0) + 1;
        return freq;
      }, {})
    );
  };

  renderChart() {
    const data = this.state.wordFrequency
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    console.log(data);

    // your code here
    let words = this.state.wordFrequency;
    const fontSize = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(words, function (row) {
          return row[1];
        }),
      ])
      .range([0, 50]);

    d3.select(".svg_parent")
      .selectAll("text")
      .data(data)
      .join("text")
      .attr("text-anchor", "middle")
      .attr("y", 100)
      .attr("x", function (d, i) {
        let coord = 5 * 180 + 150;
        oldOrder.forEach(function (val, i) {
          if (val[0] === d[0]) coord = i * 180 + 150;
        });
        console.log(d[0], coord);
        return coord;
      })
      .style("font-size", function (d) {
        let size = "0px";
        oldOrder.forEach(function (val) {
          if (val[0] === d[0]) size = `${fontSize(val[1]) * 1.5}px`;
        });
        return size;
      })
      .transition()
      .duration(2000)
      .text(function (d) {
        return d[0];
      })
      .attr("x", function (d, i) {
        return i * 180 + 150;
      })
      .style("font-size", function (d) {
        return `${fontSize(d[1]) * 1.5}px`;
      });

    oldOrder = data;
  }

  render() {
    return (
      <div className="parent">
        <div className="child1" style={{ width: 1000 }}>
          <textarea
            type="text"
            id="input_field"
            style={{ height: 150, width: 1000 }}
            defaultValue={
              "The streets were filled with people, people walking, people talking, people laughing, people in a hurry. Everyone seemed to be in a rush, moving quickly from one place to another. The city was alive with activity, with people everywhere you looked. The noise of the city was constant, with cars honking, people chatting, and footsteps echoing through the streets. It was a city full of people, a city where life never stopped."
            }
          />
          <button
            type="submit"
            value="Generate Matrix"
            style={{ marginTop: 10, height: 40, width: 1000 }}
            onClick={() => {
              var input_data = document.getElementById("input_field").value;
              this.setState({
                wordFrequency: this.getWordFrequency(input_data),
              });
            }}
          >
            Generate WordCloud
          </button>
        </div>
        <div className="child2" style={{ width: 1000 }}>
          <svg className="svg_parent" style={{ width: "100%" }}></svg>
        </div>
      </div>
    );
  }
}

export default App;
