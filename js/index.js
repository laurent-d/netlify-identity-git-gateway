document.addEventListener("DOMContentLoaded", function(event) {
  const resultSelector = document.querySelector("#result");
  const filesSelector = document.querySelector("#files");
  const pathSelector = document.querySelector("#path");
  const saveBtn = document.querySelector("#save");
  const readBtn = document.querySelector("#read");
  const netlifyUser = netlifyIdentity.currentUser();
  let workingFile = "newfile.txt";
  let isRaw;

  const ignoreFile = [".eslintrc", ".gitignore", ".stylelintrc", "package.json", "yarn.lock"];
  const rawFileArr = [".html", ".png"];

  netlifyIdentity.on("login", function(user) {
    getContent(workingFile);
    displayContent();
  });

  saveBtn.addEventListener("click", function() {
    saveContent(workingFile, isRaw);
  });

  readBtn.addEventListener("click", function() {
    getContent(workingFile);
  });

  document.addEventListener("click", function(e) {
    if (e.target.dataset.name && e.target.dataset.type === "file") {
      const fileName = e.target.dataset.name;
      const fileNameRaw = e.target.dataset.raw;
      isRaw = e.target.dataset.raw;
      workingFile = fileName;
      pathSelector.innerHTML = workingFile;
      getContent(fileName, fileNameRaw);
    }
  });

  if (netlifyUser) {
    // console.log("logged");
    getContent(workingFile);
    pathSelector.innerHTML = workingFile;
    displayContent();
  } else {
    // console.log("not logged");
  }

  function getContent(file, type) {
    getData(file, type).then(function(result) {
      const data = result.content;
      console.log(data);
      if (type != "true") {
        console.log("not raw");
        const converter = new showdown.Converter();
        const html = converter.makeHtml(data);
        resultSelector.style.whiteSpace = "inherit";
        resultSelector.innerHTML = data;
      } else {
        console.log("raw");
        resultSelector.style.whiteSpace = "break-spaces";
        resultSelector.innerText = data;
      }
      // resultSelector.textContent = data;
    });
  }

  function saveContent(file, type) {
    console.log({ type });
    let dataContent;
    if (type !== "true") {
      dataContent = resultSelector.innerHTML;
    } else {
      dataContent = resultSelector.innerText;
    }
    saveData(file, dataContent).then(function(result) {
      // console.log(result);
      saveNotification();
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
        const fileName = file.name;
        //let isRawFile = false;
        //if (fileName.includes(rawFile)) { isRawFile = true; }

        let isRawFile = rawFileArr.some(rawFile => fileName.includes(rawFile));

        //console.log({isRawFile});

        html += "<li>";
        html += `<a data-name="${file.name}" data-type="${file.type}" data-raw="${isRawFile}" >${file.name}</a>`;
        html += "</li>";
      }
    }
    // return the html
    filesSelector.innerHTML = html;
  }

  function saveNotification() {
    Toastify({
      text: "File saved 🎉",
      duration: 2000,
      gravity: "bottom",
      position: "center",
      style: {
        background: "rgb(79 70 229)",
        color: "white",
        borderRadius: "0.5rem",
      },
    }).showToast();
  }
});
