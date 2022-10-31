const loginSelector = document.querySelector('#login');
const resultSelector = document.querySelector('#result');

loginSelector.addEventListener('click', function () {
  netlifyIdentity.open()
})

netlifyIdentity.on('login', function(user) {

  loginSelector.innerHTML = 'Log Out'

  getData('README.md').then(function(result) {
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
    getData(file).then(function(result) {
      console.log(result)
      let data = result.content
      var converter = new showdown.Converter(),
          html = converter.makeHtml(data)
          resultSelector.innerHTML = html
    })
  }

  function saveContent(file) {
    saveData(file, 'Some data').then(function(result){
      console.log(result);
    });
  }


})
