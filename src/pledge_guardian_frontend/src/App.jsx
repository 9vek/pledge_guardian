import React, { Component } from "react"
import { AuthClient } from "@dfinity/auth-client"
import { createRoot } from "react-dom/client"
import './index.css'

import Pledge from "./Pledge"
import InputArea from "./InputArea"
import Login from "./Login"

import { canisterId, createActor } from "../../declarations/pledge_guardian_backend";

class Container extends Component {

  constructor() {
    super();
    this.state = { 
      startAt: 0,
      size: 5,
      pledgeList: [],
      isAuthenticated: false,
      identity: null,
    };
    this.loadMore = this.loadMore.bind(this)
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.updatePledgeList = this.updatePledgeList.bind(this)
  }

  async componentDidMount() {
    this.authClient = await AuthClient.create()
    const isAuthenticated = await this.authClient.isAuthenticated()
    if (isAuthenticated) {
      this.actor = createActor(canisterId, {
        agentOptions: {
          identity: this.authClient.getIdentity(),
        },
      })
      this.setState({
        isAuthenticated,
        principal: this.authClient.getIdentity().getPrincipal().toString()
      })
    }
    else {
      this.actor = createActor(canisterId)
    }
    const pledgeList = await this.actor.get_pledge_list(0, 5)
    this.setState({ pledgeList })
  }

  createInputArea() {
    if (this.state.isAuthenticated) {
      return <InputArea actor={ this.actor } func={ this.updatePledgeList } />
    } else {
      return <Login func={ this.login } />
    }
  }

  updatePledgeList(pledge) {
    this.state.pledgeList.unshift(pledge)
    this.setState({ pledgeList: this.state.pledgeList })
  }

  renderPledgeList() {
    return this.state.pledgeList.map(
      (pledge, index) => <Pledge key={index} pledge={pledge} />
    )
  }

  async login() {
    await this.authClient.login({
      identityProvider: "http://127.0.0.1:16383/?canisterId=rwlgt-iiaaa-aaaaa-aaaaa-cai",
      onSuccess: async () => {
        this.actor = createActor(canisterId, {
          agentOptions: {
            identity: this.authClient.getIdentity(),
          },
        })
        this.setState({
          isAuthenticated: true,
          principal: this.authClient.getIdentity().getPrincipal().toString()
        })
      },
    });
  }

  async logout() {
    await this.authClient.logout()
    this.setState({ isAuthenticated: await this.authClient.isAuthenticated() })
  }

  async loadMore() {
    this.state.startAt += 5;
    const morePledgeList = await this.actor.get_pledge_list(this.state.startAt, this.state.size)
    const newPledgeList = this.state.pledgeList.concat(morePledgeList)
    this.setState({ pledgeList: newPledgeList  })
  }

  render() {

    return (
      <div className="container max-w-xl mx-auto my-16">
        <div className="font-bold text-white text-2xl" onClick={this.logout}>
          Pledge Guardian
        </div>
        <div className="text-white">{ "Your Identity is :" + this.state.principal }</div>
        <hr className="bg-stone-200 mt-4" />
        { this.createInputArea() }
        <div id="pledgeList">
          {this.renderPledgeList()}
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