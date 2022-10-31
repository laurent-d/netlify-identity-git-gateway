document.addEventListener("DOMContentLoaded", function(event) {
  const resultSelector = document.querySelector('#result');
  const filesSelector = document.querySelector('#files');
  const saveBtn = document.querySelector('#save');
  const readBtn = document.querySelector('#read');
  const resultContent = resultSelector.innerHTML;
  const workingFile = "newfile.txt";
  const netlifyUser = netlifyIdentity.currentUser();

  netlifyIdentity.on('login', function (user) {
    getContent(workingFile);
    displayContent();
  });

  saveBtn.addEventListener('click', function () {
    saveContent(workingFile);
  });

  readBtn.addEventListener('click', function () {
    getContent(workingFile);
  });

  if (netlifyUser) {
    console.log("logged");
    getContent(workingFile);
    displayContent();
  } else {
    console.log("not logged");
  }


  getData(workingFile).then(function (result) {
    console.log(result)
    let data = result.content
    var converter = new showdown.Converter(),
      html = converter.makeHtml(data)
    resultSelector.innerHTML = html
  })

  // save data example
  /*
  saveData('newfile.txt', 'Some data').then(function(result){
      console.log(result);
  });
  */

  function getContent(file) {
    getData(file).then(function (result) {
      console.log(result)
      let data = result.content
      var converter = new showdown.Converter(),
        html = converter.makeHtml(data)
      resultSelector.innerHTML = html
    })
  }

  function saveContent(file) {
    const dataContent = resultSelector.innerHTML;
    saveData(file, dataContent).then(function (result) {
      console.log(result);
    });
  }

  function displayContent() {
    fetchData().then(function (result) {
      console.log(result)
      filesSelector.innerHTML = result;
    })
  }

});
