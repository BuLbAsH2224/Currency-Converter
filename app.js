function createEl(Attribut){
  return document.createElement(Attribut)
}
function getEl(Attribut){
  return document.querySelector(Attribut)
}
function getEls(Attribut){
  return document.querySelectorAll(Attribut)
}


function byField(fieldName){
return (a, b) => a[fieldName] > b[fieldName] ? 1 : -1;
}

let UserVallets = undefined
const DefaultVallet = ["USD","EUR"] // Currencies that appear by default
if(localStorage.getItem("UserVallets") != undefined){
   UserVallets = JSON.parse(localStorage.getItem("UserVallets"))
}

let BYNel =  getEl(".BYN")
let Vallets = []



function fillSelection(){
 let El = getEl(".ChoiceVallets")
for (let item of Vallets) {
  if(DefaultVallet.includes(item.Cur_Abbreviation) == false){
  let div = createEl("div")
  div.classList.add("ValletChoice")
  div.dataset.choiced = "false"

  let Abbr = createEl("h3")
  Abbr.innerText = item.Cur_Abbreviation

  let Name = createEl("h5")
  Name.innerText = item.Cur_Name
  
  ValletIndex = Vallets.findIndex(el => el.Cur_Abbreviation === item.Cur_Abbreviation)
  div.id = `in${ValletIndex}`

  div.addEventListener("click",(event) => {
    let index = div.id.slice(2)
    div.classList.toggle("Choiced")
    if(div.dataset.choiced == "false"){
      div.dataset.choiced = "true"
      CreateValletCurrency(Vallets[index],true)
    }
    else{

      if(getEl(`#Index${index}`) != null){
      getEl(`#Index${index}`).remove()
      }
      div.dataset.choiced = "false"
    }
    SaveUserVallets()
  })
if(UserVallets != undefined){
  if(UserVallets.includes(item.Cur_Abbreviation)){
    div.classList.toggle("Choiced")
    if(div.dataset.choiced == "false"){
      div.dataset.choiced = "true"
    }
  
  }
}

  El.append(div)
  div.append(Abbr)
  div.append(Name)
 
  }
}
}


async function GetValletArray(){
  try{
   let arr1 = await fetch("https://api.nbrb.by/exrates/rates?periodicity=0")
   arr1 = await arr1.json()
   let arr2 = await fetch("https://api.nbrb.by/exrates/rates?periodicity=1")
   arr2 = await arr2.json()
    Vallets = arr1.concat(arr2); 
    Vallets.sort(byField("Cur_Abbreviation"));
      for (let item of DefaultVallet) {
        CreateValletCurrency(Vallets[Vallets.findIndex(el => el.Cur_Abbreviation == item)],false)
      }
      if(UserVallets != undefined){
      for (let item of UserVallets) {
        CreateValletCurrency(Vallets[Vallets.findIndex(el => el.Cur_Abbreviation == item)],true)
      }
    }
    getEl(".USD").value = 1
    CalculateVallet( getEl(".USD"))
    BYNel.addEventListener("input",() => {CalculateVallet(BYNel)})
    let divChoice =  getEl(".ChoiceVallets")
   
    fillSelection()

    getEl(".ButtonAdd").addEventListener("click",()=>{divChoice.classList.toggle("off")})
    getEl(".CloseButton").addEventListener("click",()=>{divChoice.classList.toggle("off")})
    getEl(".LoadText").classList.add("off")
    getEl(".LoadGif").classList.add("off")
  }
  catch(error){
    getEl(".LoadText").innerText = error
    getEl(".LoadText").style.color = "red"
  }
    }


function SaveUserVallets(){
  let Els = getEls(".ValletChoice")
  let UserVall = []
  for (let item of Els) {
    if(item.dataset.choiced == "true"){
      let index = item.id.slice(2)
      UserVall.push(Vallets[index].Cur_Abbreviation)
    }
  }
  localStorage.setItem("UserVallets",JSON.stringify(UserVall))
}


function CalculateVallet(El){

let Arr =  getEls(".Another");
if(El.id == "INPUTbyn"){
  value = El.value
  for (let item of Arr) {
      item.value = Math.round(parseFloat(BYNel.value) / Vallets[item.dataset.index].Cur_OfficialRate * Vallets[item.dataset.index].Cur_Scale* 1000) / 1000 
  }
}
else{

BYNel.value = Math.round(El.value * Vallets[El.dataset.index].Cur_OfficialRate / Vallets[El.dataset.index].Cur_Scale * 1000) / 1000 
let arr = getEls(".Another")
let Arr = [];
for(let i = 0;i<arr.length;i++)Arr.push(arr[i]) //convert NodeList to Array
let index = Arr.findIndex(el => el.dataset.index === El.dataset.index)
Arr.splice(index,1)
for (let item of Arr) {
  item.value = Math.round(parseFloat(BYNel.value) / Vallets[item.dataset.index].Cur_OfficialRate * Vallets[item.dataset.index].Cur_Scale* 1000) / 1000 
}
}
}






function CreateValletCurrency(Vallet,AddDelete){
  
 ValletIndex = Vallets.findIndex(el => el.Cur_Abbreviation === Vallet.Cur_Abbreviation)

  let DivOsnova = createEl("div")
  DivOsnova.classList.add("DivOsnova")
  DivOsnova.id = `Index${ValletIndex}`

  //AddDelete = AddDelete || true


  let div = createEl("div")
  div.classList.add("ValletDiv")

  let name = createEl("h4")
  name.innerText = Vallet.Cur_Name
  name.classList.add("VallName")

  let Abbreviation = createEl("h2")
  Abbreviation.innerText = Vallet.Cur_Abbreviation
  Abbreviation.classList.add("Abbr")

  let InputAnotherVallet = createEl("input")
  InputAnotherVallet.type = "number"
  if(BYNel != null && BYNel != undefined){  InputAnotherVallet.value = Math.round(parseFloat(BYNel.value) / Vallet.Cur_OfficialRate / Vallet.Cur_Scale * 1000) / 1000  }
  else{InputAnotherVallet.value = Vallet.Cur_Scale}
 
  InputAnotherVallet.min = 0
  InputAnotherVallet.addEventListener("input",() => {CalculateVallet(InputAnotherVallet)})
  InputAnotherVallet.classList.add("Another");
  InputAnotherVallet.dataset.index = ValletIndex
  InputAnotherVallet.id = "INPUT"
  InputAnotherVallet.classList.add(`${Vallet.Cur_Abbreviation}`);


  let DeleteButton = createEl("img")
  DeleteButton.dataset.index = ValletIndex
  DeleteButton.src = "krest.png"
  DeleteButton.classList.add("DeleteButton")
  DeleteButton.addEventListener("click",(event) => {document.querySelector(`#in${event.target.dataset.index}`).click()})
  

  getEl(".forAnotherVallets").append(DivOsnova)
  DivOsnova.append(div)
  div.append(Abbreviation)
  div.append(InputAnotherVallet)
  div.after(name)
  if(AddDelete){div.after(DeleteButton)}

  CalculateVallet(BYNel)

}

//work with BodyColor

let InputColor = document.querySelector("#InputColor")

if(localStorage.getItem("BodyColor") != undefined){
  document.body.style.background  = `linear-gradient(0deg, rgb(210, 238, 255) 0%, ${localStorage.getItem("BodyColor")} 100%)`
  InputColor.value = localStorage.getItem("BodyColor")
}


InputColor.addEventListener("input",()=>{
  document.body.style.background  = `linear-gradient(0deg, rgb(210, 238, 255) 0%, ${InputColor.value} 100%)`
  localStorage.setItem("BodyColor",`${InputColor.value}`)
})



GetValletArray()
