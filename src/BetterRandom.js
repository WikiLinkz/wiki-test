import React, { Component } from 'react'
import axios from 'axios';

class BetterRandom extends Component {
  constructor() {
    super()
    this.state = {
      start: '',
      target: '',
      topArticles: [],
      gameTime: 20,
      loading: false,
      loadingTime: 10
    }

    this.generateGame = this.generateGame.bind(this)
    this.countDown = this.countDown.bind(this)
  }

  async componentDidMount() {
    // get the top 1000 articles from the day previous
    const date = getDate()
    const articlesRes = await axios.get(`https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia.org/all-access/${date[0]}/${date[1]}/${date[2]}`)
    this.setState({
      topArticles: articlesRes.data.items[0].articles
    })

  }
  async generateGame() {
    //get random articles from topArticles
    const randomNums = getRandomNums()
    this.setState({
      start: this.state.topArticles[randomNums[0]].article,
      target: this.state.topArticles[randomNums[1]].article
    })
    this.countDown()
  }

  countDown() {
    setInterval(() => {
      if (this.state.gameTime === 0) {
        this.setState({
          gameTime: 10
        })
      }
      this.setState({
        gameTime: this.state.gameTime - 1
      })
      console.log('gameTime =', this.state.gameTime)
    }, 1000)
  }

  render() {
    const { start, target, gameTime } = this.state
    return (
      <div id="better-random">
        <h1>WikiLinks Game</h1>
        <div id="start-end">
          <button onClick={this.generateGame}>Generate Game</button>
          <p>Start: {cleanTitle(start)}</p>
          <p>Target: {cleanTitle(target)}</p>
          <button>Join Game {gameTime}s</button>
        </div>
      </div>
    )
  }
}

const padNum = (num) => {
  const strNum = num.toString()
  if (num < 10) return strNum.padStart(2, '0')
  return num
}

const getDate = () => {
  const newDate = new Date()
  const currentYear = newDate.getFullYear()
  const currentMonth = padNum(newDate.getMonth() + 1)
  const currentDay = padNum(newDate.getDate() - 1)
  return [currentYear, currentMonth, currentDay]
}

const getRandomTarget = (min, max, start) => {
  var target = Math.floor(Math.random() * (max - min + 1)) + min
  return (target === start) ? getRandomTarget(min, max) : target
}

const getRandomNums = () => {
  const randomStart = Math.floor(Math.random() * (999 - 3) + 3)
  const randomTarget = Math.floor(getRandomTarget(3, 999, randomStart))
  return [randomStart, randomTarget]
}

const cleanTitle = (title) => {
  return title.split('_').join(' ')
}

export default BetterRandom
