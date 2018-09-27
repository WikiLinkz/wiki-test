import React, { Component } from 'react';
import './clean.css'
import axios from 'axios'

class App extends Component {
  constructor() {
    super()
    this.state = {
      html: '',
      html2: '',
      input: '',
    }

    this.handleClick = this.handleClick.bind(this)
    this.handleClick2 = this.handleClick2.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.setInput = this.setInput.bind(this)
    this.createMarkup = this.createMarkup.bind(this)
  }


  async handleClick() {
    const res = await axios.get(`https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${this.state.input}&origin=*`)
    console.log('res 1 =', res)
    const htmlRes = res.data.parse.text['*']
    this.setState({
      html: htmlRes
    })
  }

  async handleClick2() {
    const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/html/${this.state.input}`)
    console.log('res 2 =', res)
    const htmlRes = res.data
    this.setState({
      html2: htmlRes
    })
  }

  handleChange(evt) {
    const value = evt.target.value
    this.setState({
      input: value
    })
  }

  setInput(evt) {
    this.setState({
      input: evt.target.value
    })
  }

  createMarkup(html) {
    return { __html: html };
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
          <button onClick={this.setInput} value='Fullstack_Academy'>Fullstack</button>
          <button onClick={this.setInput} value='Lower_Manhattan'>FiDi</button>
          <button onClick={this.setInput} value='JavaScript'>JavaScript</button>

        </div>
        <input type="text" onChange={this.handleChange} value={this.state.input} />
        <div></div>
        <button onClick={this.handleClick}>Normal API</ button>
        <div></div>
        <button onClick={this.handleClick2}>New API</button>
        <div></div>
        {
          (this.state.html === '') ? null : <div dangerouslySetInnerHTML={this.createMarkup(this.state.html)} />
        }
        {
          (this.state.html2 === '') ? null : <div dangerouslySetInnerHTML={this.createMarkup(this.state.html2)} />
        }
      </div>
    );
  }
}

export default App;
