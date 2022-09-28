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

window.onload = async () => {
  let pledges = await pledge_guardian_backend.get_all()

  const pledgesDiv = document.querySelector("#pledges")
  pledges.forEach((pledge) => {
    let colorIndex = 0
    for (let i = 0; i < pledge.display_name.length; i++) {
      colorIndex += pledge.display_name.charCodeAt(i)
    }
    colorIndex = colorIndex % 8
    pledgesDiv.innerHTML += `
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



// document.querySelector("form").addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const button = e.target.querySelector("button");

//   const name = document.getElementById("name").value.toString();

//   button.setAttribute("disabled", true);

//   // Interact with foo actor, calling the greet method
//   const pledges = await pledge_guardian_backend.get_all();
//   console.log(pledges);

//   button.removeAttribute("disabled");

//   document.getElementById("greeting").innerText = greeting;

//   return false;
// });
