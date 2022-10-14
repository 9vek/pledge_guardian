import { pledge_guardian_backend } from "../../declarations/pledge_guardian_backend"
import './index.css'

const colorPool = [
  "cyan", // bg-cyan-900 hover:bg-cyan-800
  "pink", // bg-pink-900 hover:bg-pink-800
  "blue", // bg-blue-900 hover:bg-blue-800
  "indigo", // bg-indigo-900 hover:bg-indigo-800
  "green", // bg-green-900 hover:bg-green-800
  "yellow", // bg-yellow-900 hover:bg-yellow-800
  "amber", // bg-amber-900 hover:bg-amber-800
  "purple", // bg-purple-900 hover:bg-purple-800
]

let startPointer = 0

const pledgeList = document.querySelector("#pledgeList")
const newPledgeDescriptionBox = document.querySelector("#newPledgeDescription")
const newPledgeDisplayNameBox = document.querySelector("#newPledgeDisplayName")
const newPledgeSubmitButton = document.querySelector("#newPledgeSubmit")
const loadMoreButton = document.querySelector("#loadMoreButton")

window.onload = async () => {
  const pledges = await fetchPledgeList(0, 5)
  renderNewPledges(pledges)
}

async function fetchPledgeList(start, size) {
  startPointer = start + size
  let pledges = await pledge_guardian_backend.get_pledge_list(start, size)
  pledges.sort((p1, p2) => {
    if (p1.time > p2.time) {
      return -1
    } else if (p1.time == p2.time) {
      return 0
    } else {
      return 1
    }
  })
  return pledges
}


function renderNewPledges(pledges, clean=false) {
  if (clean) pledgeList.innerHTML = ''
  pledges.forEach((pledge) => {
    let colorIndex = 0
    for (let i = 0; i < pledge.display_name.length; i++) {
      colorIndex += pledge.display_name.charCodeAt(i)
    }
    colorIndex = colorIndex % 8
    pledgeList.innerHTML += `
    <div class="text-white bg-${colorPool[colorIndex]}-900 rounded-lg p-4 mb-12 mt-8 hover:shadow-xl hover:bg-${colorPool[colorIndex]}-800 transition-all">
      <div>${pledge.description}</div>
      <hr/ class="my-1 bg-stone-500">
      <div class="text-stone-400 text-xs my-2">
        <div>TimeStamp: ${pledge.time}</div>
        <div>Identity: ari7x-pocge-gat47-albaz-p42hd-vnbfc-pnv2b-eaois-lyhmc-a63mc-zqe</div>
      </div>
      <div class="float-right bg-stone-900 rounded-lg shadow-xl p-2">${pledge.display_name}</div>
    </div>
    `
  })
}

async function submitNewPledge() {
  const newPledgeDescription = newPledgeDescriptionBox.value;
  const newPledgeDisplayName = newPledgeDisplayNameBox.value;
  const pledge = await pledge_guardian_backend.update({
    description: newPledgeDescription,
    display_name: newPledgeDisplayName
  })
  const pledges = [pledge]
  renderNewPledges(pledges, false)
}

newPledgeSubmitButton.onclick = submitNewPledge

loadMoreButton.onclick = async () => {
  const start = startPointer
  const pledges = await fetchPledgeList(start, 5)
  renderNewPledges(pledges)
}