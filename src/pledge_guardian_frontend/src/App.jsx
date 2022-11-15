import React, { Component } from "react"
import { pledge_guardian_backend } from "../../declarations/pledge_guardian_backend"
import { AuthClient } from "@dfinity/auth-client"
import { createRoot } from "react-dom/client"
import './index.css'

import Pledge from "./Pledge"
import InputArea from "./InputArea"
import Login from "./Login"

class Container extends Component {

  constructor() {
    super();
    this.state = { 
      startAt: 0,
      size: 5,
      pledgeList: [],
      isAuthenticated: false
    };
    this.loadMore = this.loadMore.bind(this)
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
  }

  async componentDidMount() {
    const pledgeList = await pledge_guardian_backend.get_pledge_list(0, 5)
    this.setState({ pledgeList })
    this.authClient = await AuthClient.create()
    this.setState({ isAuthenticated: await this.authClient.isAuthenticated() })
  }

  createInputArea() {
    if (this.state.isAuthenticated) {
      return <InputArea />
    } else {
      return <Login func={ this.login } />
    }
  }

  createPledgeList() {
    return this.state.pledgeList.map(
      (pledge, index) => <Pledge key={index} pledge={pledge} />
    )
  }

  async login() {
    await this.authClient.login({
      onSuccess: async () => {
        this.setState({ isAuthenticated: await this.authClient.isAuthenticated() })
      },
    });
  }

  async logout() {
    await this.authClient.logout()
    this.setState({ isAuthenticated: await this.authClient.isAuthenticated() })
  }

  async loadMore() {
    this.state.startAt += 5;
    const morePledgeList = await pledge_guardian_backend.get_pledge_list(this.state.startAt, this.state.size)
    const newPledgeList = this.state.pledgeList.concat(morePledgeList)
    this.setState({ pledgeList: newPledgeList  })
  }

  render() {

    return (
      <div className="container max-w-xl mx-auto my-16">
        <div className="font-bold text-white text-2xl" onClick={this.logout}>
          Pledge Guardian
        </div>
        <hr className="bg-stone-200 mt-4" />
        { this.createInputArea() }
        <div id="pledgeList">
          {this.createPledgeList()}
        </div>
        <div className="m-4 p-4">
          <div id="loadMoreButton" onClick={this.loadMore} className="p-4 w-fit rounded-md bg-stone-800 hover:bg-stone-600 cursor-pointer text-white text-xl text-center justify-center border border-stone-300 mx-auto">
            Load More
          </div>
        </div>
      </div>
    )
  }
}

const root = createRoot(document.getElementById("app"))
root.render(<Container />)