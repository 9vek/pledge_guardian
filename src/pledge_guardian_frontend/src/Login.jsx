import React, { Component } from "react"

class Login extends Component {

  constructor() {
    super()
  }

  render() {
    return (
      <div className="py-4 grid grid-cols-1 place-items-center">
        <div id="loadMoreButton" onClick={this.props.func} className="bg-lime-600 hover:bg-lime-500 px-4 py-2 rounded-md text-white text-2xl">
          Login
        </div>
      </div>
    )
  }
}

export default Login