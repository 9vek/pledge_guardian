import React, { Component } from "react"

class InputArea extends Component {

  constructor() {
    super()
  }

  render() {
    return (
      <div className="py-4 grid grid-cols-4 space-x-2 space-y-2">
        <textarea id="newPledgeDescription" className="bg-stone-700 col-span-3 row-span-2 rounded-md text-white p-1 mt-2 outline-none"></textarea>
        <input id="newPledgeDisplayName" className="bg-stone-700 text-center text-white rounded-md p-1 outline-none" type="text" />
        <button id="newPledgeSubmit" onClick={this.login} className="bg-lime-600 hover:bg-lime-500 p-1 rounded-md text-white text-xs">Add</button>
      </div>
    )
  }
}

export default InputArea