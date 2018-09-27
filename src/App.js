import React, { Component } from 'react';
import './clean.css'
import axios from 'axios'

class App extends Component {
  constructor() {
    super()
    this.state = {
      title: '',
      html: '',
      isLoading: false
    }
    this.handleClick = this.handleClick.bind(this)
    this.titleize = this.titleize.bind(this)
  }

  async handleClick(evt) {
    evt.preventDefault()
    this.setState({ isLoading: true })
    if (evt.target.tagName !== 'A') return

    const title = this.titleize(evt.target.title)
    await this.setState({ title })
    console.log('title', this.state.title)
    const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/html/${this.state.title}`)
    const htmlRes = res.data
    this.setState({ html: htmlRes, isLoading: false })

  }

  titleize(title) {
    return title.split(' ').join('_')
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          API Tests
        </p>
        <div>
          <p>Wiki Pages</p>
          <ul>
            <li><a href="/wiki/Commonwealth_of_Nations" onClick={this.handleClick} title='Fullstack Academy'>Fullstack</a></li>
            {/* <li><a href="/wiki/Commonwealth_of_Nations" onClick={this.handleClick} title='Lower Manhattan'><img src='/public/pets.jpg' /></a></li>
            <li><a href="/wiki/Commonwealth_of_Nations" onClick={this.handleClick} title='JavaScript'>JavaScript</a></li> */}
          </ul>
        </div>
        {
          (this.state.html === '') ? <div><h1>hi</h1></div> : <div className='wiki-article' onClick={this.handleClick} dangerouslySetInnerHTML={{ __html: this.state.html }} />
        }
      </div>
    );
  }
}

export default App;
