document.addEventListener("DOMContentLoaded", function(event) {
  const resultSelector = document.querySelector('#result');
  const resultContent = resultSelector.innerHTML;
  const workingFile = "newfile.txt";
  const user = netlifyIdentity.currentUser();

  netlifyIdentity.on('init', user => console.log('init', user));

  netlifyIdentity.on('login', function (user) {
    getContent(workingFile);
  });

  if (user) {
    console.log("logged");
    getContent(workingFile);
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
    saveData(file, 'Some data').then(function (result) {
      console.log(result);
    });
  }

});
