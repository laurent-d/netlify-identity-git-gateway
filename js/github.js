async function getData(mypath = "") {
  const user = netlifyIdentity.currentUser();
  const token = user.token.access_token;
  const url = `/.netlify/git/github/contents/${mypath}`;
  const bearer = `Bearer ${token}`;

  return fetch(url, {
    method: "GET",
    withCredentials: true,
    credentials: "include",
    headers: {
      Authorization: bearer,
      "Content-Type": "application/json",
    },
  }).then(resp => resp.json()).then(data => {
    if (data.code === 400) {
      netlifyIdentity.refresh().then(function(token) {
        getData(mypath);
      });
    } else {
      // base64 decode content
      data.content = atob(data.content);
      return data;
    }
  })
    .catch(error => error);
}

async function fetchData(mypath = "") {
  const user = netlifyIdentity.currentUser();
  const token = user.token.access_token;
  const url = `/.netlify/git/github/contents/${mypath}`;
  const bearer = `Bearer ${token}`;

  return fetch(url, {
    method: "GET",
    withCredentials: true,
    credentials: "include",
    headers: {
      Authorization: bearer,
      "Content-Type": "application/json",
    },
  }).then(resp => resp.json()).then(data => {
    if (data.code === 400) {
      netlifyIdentity.refresh().then(function(token) {
        getData(mypath);
      });
    } else {
      // base64 decode content
      return data;
    }
  })
    .catch(error => error);
}

async function saveData(mypath, data) {
  return getData(mypath).then(function(curfile) {
    const user = netlifyIdentity.currentUser();
    const token = user.token.access_token;
    const opts = {
      path: mypath,
      message: "initial commit",
      content: btoa(data),
      branch: "main",
      committer: { name: "Dashpilot", email: "support@dashpilot.com" },
    };
    if (typeof curfile !== "undefined") {
      opts.sha = curfile.sha;
    }

    const url = `/.netlify/git/github/contents/${mypath}`;
    const bearer = `Bearer ${token}`;
    return fetch(url, {
      body: JSON.stringify(opts),
      method: "PUT",
      withCredentials: true,
      credentials: "include",
      headers: {
        Authorization: bearer,
        "Content-Type": "application/json",
      },
    }).then(resp => resp.json()).then(data => {
      if (data.code === 400) {
        netlifyIdentity.refresh().then(function(token) {
          saveData(mypath);
        });
      } else {
        return data;
      }
    })
      .catch(error => this.setState({
        message: `Error: ${error}`,
      }));
  });
}
