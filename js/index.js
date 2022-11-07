import netlifyIdentity from "netlify-identity-widget";
import Toastify from "toastify-js";
import showdown from "showdown";
import { getData, fetchData, saveData } from "./github";

import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Placeholder from '@tiptap/extension-placeholder';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Image from '@tiptap/extension-image';
import Dropcursor from '@tiptap/extension-dropcursor';
import FloatingMenu from '@tiptap/extension-floating-menu';
import BubbleMenu from '@tiptap/extension-bubble-menu'

import '../css/style.js';

document.addEventListener("DOMContentLoaded", function() {
  netlifyIdentity.init();

  const resultSelector = document.querySelector("#result");
  const filesSelector = document.querySelector("#files");
  const pathSelector = document.querySelector("#path");
  const saveBtn = document.querySelector("#save");
  const readBtn = document.querySelector("#read");
  const boldBtn = document.querySelector("#bold");
  const italicBtn = document.querySelector("#italic");
  const h1Btn = document.querySelector("#h1");
  const h2Btn = document.querySelector("#h2");
  const paraBtn = document.querySelector("#para");
  const createBtn = document.querySelector("#create");
  const createInput = document.querySelector("#filename");
  const avatarInput = document.querySelector("#avatar");
  const netlifyUser = netlifyIdentity.currentUser();
  let workingFile = "newfile.txt";
  let isRaw;
  let newContent = "";

  const ignoreFile = [".eslintrc", ".gitignore", ".stylelintrc", "package.json", "yarn.lock"];
  const rawFileArr = [".html", ".jpg", ".jpeg", ".png"];
  const mediaFileArr = [".jpg", ".jpeg", ".png"];

  netlifyIdentity.on("login", function() {
    getContent(workingFile);
    displayContent();
    console.log("login");
  });

  const CustomDocument = Document.extend({
    content: 'heading block*',
  })

  const editor = new Editor({
    element: document.querySelector('.element'),
    content: '<p>Hello World!</p>',
    extensions: [
      CustomDocument,
      //Dropcursor,
      Image,
      StarterKit.configure({
        document: false,
      }),
      Placeholder.configure({
        // Use a placeholder:
        //placeholder: 'Write something …',
        // Use different placeholders depending on the node type:
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return 'What’s the title?'
          }

          return 'Can you add some further context?'
        },
      }),
      FloatingMenu.configure({
        element: document.querySelector('.floating-menu'),
      }),
      BubbleMenu.configure({
        element: document.querySelector('.bubble-menu'),
      }),
    ],
  });

  saveBtn.addEventListener("click", function() {
    saveContent(workingFile, isRaw);
  });

  createBtn.addEventListener("click", function() {
    // console.log(createInput.value);
    const file = createInput.value;
    const dataContent = atob(newContent.replace(/^(.+,)/, ""));
    // https://www.audero.it/blog/2015/10/17/upload-files-on-github-using-github-js/

    saveData(file, dataContent).then(function() {
      showNotif("File created 🎉");
    });
  });

  // Bubble menu

  boldBtn.addEventListener("click", function() {
    editor.chain().focus().toggleBold().run();
    console.log("bold");
  });

  italicBtn.addEventListener("click", function() {
    editor.chain().focus().toggleItalic().run();
    console.log("italic");
  });

  // Floating menu

  h1Btn.addEventListener("click", function() {
    editor.chain().focus().toggleHeading({ level: 1 }).run();
    console.log("bold");
  });

  h2Btn.addEventListener("click", function() {
    editor.chain().focus().toggleHeading({ level: 2 }).run();
    console.log("italic");
  });

  paraBtn.addEventListener("click", function() {
    editor.chain().focus().toggleBulletList().run();
    console.log("italic");
  });

  avatarInput.addEventListener("change", handleFileSelect, false);

  function handleFileSelect(event) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = handleFileLoad;
  }

  function handleFileLoad(event) {
    newContent = event.target.result;
    console.log({ newContent });
  }

  readBtn.addEventListener("click", function() {
    getContent(workingFile);
  });

  document.addEventListener("click", function(e) {
    if (e.target.dataset.name && e.target.dataset.type === "file") {
      const fileName = e.target.dataset.name;
      const fileNameRaw = e.target.dataset.raw;
      const fileNameMedia = e.target.dataset.media;
      isRaw = e.target.dataset.raw;
      workingFile = fileName;
      pathSelector.innerHTML = workingFile;
      getContent(fileName, fileNameRaw, fileNameMedia);
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

  function getContent(file, type, media) {
    getData(file, type, media).then(function(result) {
      // console.log(result);
      const data = result.content;
      // console.log(data);
      if (type !== "true") {
        console.log("not raw");
        const converter = new showdown.Converter();
        const html = converter.makeHtml(data);
        resultSelector.style.whiteSpace = "inherit";
        resultSelector.innerHTML = data;
        editor.commands.setContent(html);
      } else if (media != "true") {
        console.log("raw");
        resultSelector.style.whiteSpace = "break-spaces";
        resultSelector.innerText = data;
        editor.commands.setContent(data);
      } else {
        console.log("raw and image");
        resultSelector.innerHTML = `<img style="max-width:100%" src="${result.download_url}"/>`;
        editor.commands.setContent(`<img style="max-width:100%" src="${result.download_url}"/>`);
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
      showNotif();
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
    let file = "";
    for (file of data) {
      // console.log({ html });
      if (ignoreFile.indexOf(file.name) === -1) {
        const fileName = file.name;
        // let isRawFile = false;
        // if (fileName.includes(rawFile)) { isRawFile = true; }
        const isRawFile = rawFileArr.some(rawFile => fileName.includes(rawFile));
        const isMediaFile = mediaFileArr.some(mediaFile => fileName.includes(mediaFile));
        // console.log({isRawFile});
        html += "<li>";
        html += `<a data-name="${file.name}" data-type="${file.type}" data-raw="${isRawFile}" data-media="${isMediaFile}">${file.name}</a>`;
        html += "</li>";
      }
    }
    // return the html
    filesSelector.innerHTML = html;
  }

  function showNotif(msgTxt = "File saved 🎉") {
    Toastify({
      text: msgTxt,
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
