document.addEventListener("DOMContentLoaded", function(event) {

  const loginSelector = document.querySelector('#login');
  const resultSelector = document.querySelector('#result');
  const resultContent = resultSelector.innerHTML;
  const workingFile = "newfile.txt"

  loginSelector.addEventListener('click', function () {
    netlifyIdentity.open()
  })

  netlifyIdentity.on('init', user => console.log('init', user));

  netlifyIdentity.on('login', function (user) {

    loginSelector.innerHTML = 'Log Out'

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

});
