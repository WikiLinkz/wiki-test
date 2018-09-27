import React, { Component } from 'react';
import './clean.css'
import axios from 'axios'

class App extends Component {
  constructor() {
    super()
    this.state = {
      start: '',
      target: '',
      title: '',
      html: '',
      history: []
    }
    this.handleClick = this.handleClick.bind(this)
    this.titleize = this.titleize.bind(this)
    this.randomClick = this.randomClick.bind(this)
  }

  async randomClick() {
    const randWiki1 = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/random/title`)
    const randWiki2 = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/random/title`)
    const start = randWiki1.data.items[0].title
    const target = randWiki2.data.items[0].title
    const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/html/${start}`)
    const startHtml = response.data
    this.setState({
      start,
      target,
      html: startHtml,
      history: [start.split("_").join(" ")]
    })
  }

  async handleClick(evt) {
    evt.preventDefault()
    this.setState({ isLoading: true })
    if (evt.target.tagName !== 'A') return

    const title = this.titleize(evt.target.title)
    await this.setState({ title, history: [...this.state.history, evt.target.title] })
    const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/html/${this.state.title}`)
    this.setState({ html: res.data })
    console.log('clicked title: ', title, 'target title: ', this.state.target)
    if (title === this.state.target) { alert('DAAAAAMN!') }
  }

  titleize(title) {
    return title.split(' ').join('_')
  }

  render() {
    const history = this.state.history

    return (
      <div id="game-container" style={{ padding: 50 }}>
        <header className="game-header">
          <h1 className="game-title">WikiLinks Game</h1>
        </header>
        <div>
          <button onClick={this.randomClick}>Start Game</ button>
          <div className='game-start-target'>
            <p>Start: {this.state.start.split("_").join(" ")}</p>
            <p>Target: {this.state.target.split("_").join(" ")}</p>
            <p>History: {history.join(", ")}</p>
            <p>Clicks: {history.length - 1}</p>
          </div>
          <div>
            {
              (this.state.html === '') ? null : <div className='wiki-article' onClick={this.handleClick} dangerouslySetInnerHTML={{ __html: this.state.html }} />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
