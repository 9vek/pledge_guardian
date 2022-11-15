import React, { Component } from "react"

class Pledge extends Component {

  constructor() {
    super()
    this.colorPool = [
      "cyan", // bg-cyan-900 hover:bg-cyan-800
      "pink", // bg-pink-900 hover:bg-pink-800
      "blue", // bg-blue-900 hover:bg-blue-800
      "indigo", // bg-indigo-900 hover:bg-indigo-800
      "green", // bg-green-900 hover:bg-green-800
      "yellow", // bg-yellow-900 hover:bg-yellow-800
      "amber", // bg-amber-900 hover:bg-amber-800
      "purple", // bg-purple-900 hover:bg-purple-800
    ]
  }

  getPledgeColor(text) {
    let colorIndex = 0
    for (let i = 0; i < text.length; i++) {
      colorIndex += text.charCodeAt(i)
    }
    colorIndex = colorIndex % 8
    return this.colorPool[colorIndex]
  }

  render() {
    const pledge = this.props.pledge
    const color = this.getPledgeColor(pledge.display_name)
    return (
      <div className={`text-white bg-${color}-900 rounded-lg p-4 mb-12 mt-8 hover:shadow-xl hover:bg-${color}-800 transition-all`}>
        <div>{pledge.description}</div>
        <hr className="my-1 bg-stone-500" />
        <div className="text-stone-400 text-xs my-2">
          <div>TimeStamp: {pledge.time}</div>
          <div>Identity: {Buffer.from(pledge.identity._arr).toString('hex')}</div>
        </div>
        <div className="float-right bg-stone-900 rounded-lg shadow-xl p-2">{pledge.display_name}</div>
      </div>
    )
  }
}

export default Pledge