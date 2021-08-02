//Function to JSONize csv
function csvJSON(csv) {
    var lines = csv.split("\r\n");
    var result = [];
    var headers = lines[0].split(",");
    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split(",");
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
    return JSON.stringify(result);
  }
  //Write Buttons
  function buttonCreator(data, step, element) {
    let btnDisabled = '';  
    if(step !== "step1"){
       btnDisabled = 'disabled';
    }
    for (var i = 0; i < data.length; i++) {
      let elId = data[i]
      elId = elId.replaceAll(/[& \.]/g,'')//replace periods, & and spaces
      element.innerHTML += '<label class="btn slcc3 btn-sm m-2" id="lbl_' + elId.replaceAll(/[<]/g,'L')
        .replaceAll(/[>]/g,'M')
        .replaceAll(/[≤]/g,'LT')
        .replaceAll(/[≥]/g,'MT') + '">'
        + '<input type="radio" '+btnDisabled+' id="btn_' + elId + '" name="' + step + '" class="btn" onchange="fetchPayRate()" value="'+elId+'">' + data[i]
        + '</label><br />';
    }
  }
  //Declare urls that will be used. 
  let gsheet = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQwlUFekIfqsyJoZHBo-uRMkWK7AR1L5iq59UrRslAN9ExoYhcZJH36pn2aCMYtJd-YwuhtnEXhIPfT/pub?";
  let sortedSheet = 'gid=91226759&single=true&output=csv';//Sheet with sorters
  //First for step 1, fetch to get the buttons names and render them with the for loop
  fetch(gsheet + sortedSheet).then(function (response) {
    return response.text();
  }).then(function (data) {
    var data = JSON.parse(csvJSON(data));
    data = data.sort(function (a, b) {
      return a.Cral_Sort - b.Cral_Sort;
    });
    let crla = [];
    for (var a = 0; a < data.length; a++) {
      crla.push(data[a].Crla);
    }
    crla = [...new Set(crla.map(x => x))];
    var element = document.getElementById("step1");
    buttonCreator(crla, "step1", element);
    window.sessionStorage.payData = JSON.stringify(data);
  });
  //Create a function that will be called onChange. Notice the on change property on each input type above. 
  function fetchPayRate() {
    let payRates = JSON.parse(window.sessionStorage.payData);
    let x = document.getElementById('form');
    let radOn = new Array;
    for (let i = 0; i < x.length; i++) {
      if (x.elements[i].checked === true) {
        let stepGroup = x.elements[i].name;
        radOn[stepGroup] = x.elements[i].value;
      }
    }
    //what buttons are one, this is ternary conditional declaration
    let crla = radOn["step1"] === undefined ? 1 : radOn["step1"];
    let degree = radOn["step2"] === undefined ? 1 : radOn["step2"];
    let years = radOn["step3"] === undefined ? 1 : radOn["step3"];
      console.log(crla, degree, years);
      payRates = payRates.filter(val => { return val.Crla.replaceAll(/[& \.]/g,'') === crla });
      if (degree !== 1 && crla !== "None") {
        payRates = payRates.filter(val => { return val.Degree.replaceAll(/[& \.]/g,'') === degree });
      }
      if (years !== 1) {
        payRates = payRates.filter(val => { return val.Years.replaceAll(/[& \.]/g,'') === years });
      }
      console.log(payRates)
      //console.log(payRates)
      //Write Step 2
      let step2 = payRates.sort(function(a,b){
        return a.Degree_Sort - b.Degree_Sort
      })
      let degreeButtons = []
      for(let d = 0;d < step2.length; d++){
        degreeButtons.push(step2[d].Degree)
      }
      degreeButtons = [...new Set(degreeButtons.map(x=>x))]
      let step2El = document.getElementById("step2")
      if(degree === 1 || crla === "None") {
        step2El.innerHTML = ''
        buttonCreator(degreeButtons,"step2",step2El)
      }
      //Write Step 3
      let step3 = payRates.sort(function (a, b) {
        return a.Years_Sort - b.Years_Sort;
      })
      let yearsButtons = [];
      for (var c = 0; c < step3.length; c++) {
        yearsButtons.push(step3[c].Years);
      }
      yearsButtons = [...new Set(yearsButtons.map(x => x))];
      var step3El = document.getElementById("step3");
      step3El.innerHTML = '';
      buttonCreator(yearsButtons, "step3", step3El);

      let max = payRates.length - 1;
      let amnts = new Array();
      for (var z = 0; z < payRates.length; z++) {
        amnts.push(parseFloat(payRates[z]["PayRate"]));
      }
      let maxPay = Math.max.apply(null, amnts);
      let minPay = Math.min.apply(null, amnts);
      //Write on to document
      if (maxPay === minPay) {
        document.getElementById("middle").innerHTML = '$' + payRates[0]["PayRate"];
        document.getElementById("label").children[1].classList.remove("label");
        document.getElementById("label").children[0].classList.add("label");
        document.getElementById("label").children[2].classList.add("label");
      } else {
        document.getElementById("min").innerHTML = '$' + minPay;
        document.getElementById("max").innerHTML = '$' + maxPay;
        document.getElementById("label").children[0].classList.remove("label");
        document.getElementById("label").children[2].classList.remove("label");
        document.getElementById("label").children[1].classList.add("label");
      }
      //Disable and enable buttons on certain selections
      if(crla !== 1){
        let inputs = document.querySelectorAll("input[name='step2']")
        inputs.forEach(key => {
          key.disabled = false
        })
      }
      if(degree !== 1){
        let inputs = document.querySelectorAll("input[name='step3']")
        inputs.forEach(key => {
          key.disabled = false
        })
      }
      let s2numOpts = document.querySelector("#step2").childElementCount
      let s3numOpts = document.querySelector("#step3").childElementCount
      //When none is selected then show only one option 
      if (crla === "None" || s2numOpts <= 2) {
        let elId = payRates[0].Degree.replaceAll(/[& \.]/g,'')
        document.querySelector('#lbl_'+elId).classList.add('active')
        document.querySelector("#btn_"+elId).disabled = true;
        if(crla === "None" || s3numOpts <= 2){
          elId = payRates[0].Years.replaceAll(/[& \.]/g,'').replaceAll(/[<]/g,'L')
          .replaceAll(/[>]/g,'M')
          .replaceAll(/[≤]/g,'LT')
          .replaceAll(/[≥]/g,'MT')
          document.querySelector('#lbl_'+elId).classList.add('active')
          document.querySelector("#btn_"+elId).disabled = true
        }
      }
      if(crla === "None" || s3numOpts <= 2){
        elId = payRates[0].Years.replaceAll(/[& \.]/g,'').replaceAll(/[<]/g,'L')
        .replaceAll(/[>]/g,'M')
        .replaceAll(/[≤]/g,'LT')
        .replaceAll(/[≥]/g,'MT')
        document.querySelector('#lbl_'+elId).classList.add('active')
        document.querySelector("#btn_"+elId).disabled = true
      }
  }