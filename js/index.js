document.addEventListener("DOMContentLoaded", function(event) {
  const resultSelector = document.querySelector("#result");
  const filesSelector = document.querySelector("#files");
  const pathSelector = document.querySelector("#path");
  const saveBtn = document.querySelector("#save");
  const readBtn = document.querySelector("#read");
  const netlifyUser = netlifyIdentity.currentUser();
  let workingFile = "newfile.txt";

  const ignoreFile = [".eslintrc", ".gitignore", ".stylelintrc", "package.json", "yarn.lock"];

  netlifyIdentity.on("login", function(user) {
    getContent(workingFile);
    displayContent();
  });

  saveBtn.addEventListener("click", function() {
    saveContent(workingFile);
  });

  readBtn.addEventListener("click", function() {
    getContent(workingFile);
  });

  document.addEventListener("click", function(e) {
    if (e.target.dataset.name && e.target.dataset.type === "file") {
      const fileName = e.target.dataset.name;
      console.log(fileName);
      workingFile = fileName;
      pathSelector.innerHTML = workingFile;
      getContent(fileName);
    }
  });

  if (netlifyUser) {
    console.log("logged");
    getContent(workingFile);
    pathSelector.innerHTML = workingFile;
    displayContent();
  } else {
    console.log("not logged");
  }

  getData(workingFile).then(function(result) {
    // console.log(result);
    const data = result.content;
    const converter = new showdown.Converter();
    const html = converter.makeHtml(data);
    resultSelector.innerHTML = html;
  });

  function getContent(file) {
    getData(file).then(function(result) {
      // console.log(result);
      const data = result.content;
      const converter = new showdown.Converter();
      const html = converter.makeHtml(data);
      resultSelector.innerHTML = html;
    });
  }

  function saveContent(file) {
    const dataContent = resultSelector.innerHTML;
    saveData(file, dataContent).then(function(result) {
      // console.log(result);
    });
  }

  function displayContent() {
    fetchData().then(function(result) {
      // console.log(result)
      buildTreeFiles(result);
    });
  }

  function buildTreeFiles(data) {
    let html = "";
    for (file of data) {
      if (ignoreFile.indexOf(file.name) === -1) {
        html += "<li>";
        html += `<a data-name="${file.name}" data-type="${file.type}" >${file.name}</a>`;
        html += "</li>";
      }
    }
    // return the html
    filesSelector.innerHTML = html;
  }
});
