import React, { Component } from "react"

class InputArea extends Component {

  constructor() {
    super()
    this.newPledgeDescription = React.createRef()
    this.newPledgeDisplayName = React.createRef()
    this.submitNewPledge = this.submitNewPledge.bind(this)
  }

  async submitNewPledge() {
    if (this.newPledgeDescription.current.value.length > 0 && this.newPledgeDisplayName.current.value.length > 0) {
      const pledge = await this.props.actor.update({
        description: this.newPledgeDescription.current.value,
        display_name: this.newPledgeDisplayName.current.value
      })
      this.props.func(pledge)
    }
  }

  render() {
    return (
      <div className="py-4 grid grid-cols-4 space-x-2 space-y-2">
        <textarea ref={this.newPledgeDescription} id="newPledgeDescription" className="bg-stone-700 col-span-3 row-span-2 rounded-md text-white p-1 mt-2 outline-none"></textarea>
        <input ref={this.newPledgeDisplayName} id="newPledgeDisplayName" className="bg-stone-700 text-center text-white rounded-md p-1 outline-none" type="text" />
        <button onClick={this.submitNewPledge} id="newPledgeSubmit" className="bg-lime-600 hover:bg-lime-500 p-1 rounded-md text-white text-xs">Add</button>
      </div>
    )
  }
}

export default InputArea