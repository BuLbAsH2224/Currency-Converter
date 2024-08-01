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

  div.addEventListener("click",() => {
    div.classList.toggle("Choiced")
    if(div.dataset.choiced == "false"){
      div.dataset.choiced = "true"
      CreateValletCurrency(item)
    }
    else{
      getEl(`#Index${ValletIndex}`).remove()
      div.dataset.choiced = "false"
    }
  })


  El.append(div)
  div.append(Abbr)
  div.append(Name)
 
  }
}
}


const DefaultVallet = ["USD","EUR","RUB","UAH","TRY"] // Currencies that appear by default
let BYNel =  getEl(".BYN")
let Vallets = []



async function GetValletArray(){
  try{
   let arr1 = await fetch("https://api.nbrb.by/exrates/rates?periodicity=0")
   arr1 = await arr1.json()
   let arr2 = await fetch("https://api.nbrb.by/exrates/rates?periodicity=1")
   arr2 = await arr2.json()
    Vallets = arr1.concat(arr2); 
    Vallets.sort(byField("Cur_Abbreviation"));
      for (let item of DefaultVallet) {
        CreateValletCurrency(Vallets[Vallets.findIndex(el => el.Cur_Abbreviation == item)])
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

  AddDelete = AddDelete || false 


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
  InputAnotherVallet.dataset.gays = JSON.stringify(DivOsnova);

  getEl(".forAnotherVallets").append(DivOsnova)
  DivOsnova.append(div)
  div.append(Abbreviation)
  div.append(InputAnotherVallet)
  div.after(name)

}

GetValletArray()
