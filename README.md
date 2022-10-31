<h1 id="netlifyidentityandgitgateway">TESt</h1><h1 id="netlifyidentityandgitgateway">Netlify Identity and Git Gateway</h1>
<p>Example of how to use Netlify Identity and Git Gateway to save files to Github (without using Netlify CMS)</p>
<h2 id="newblogpostondevto">New: blog post on Dev.to</h2>
<p>For an in-depth tutorial, check out my <a href="https://dev.to/dashpilot/how-to-save-your-app-s-data-to-a-github-repo-without-any-server-side-code-using-netlify-s-git-gateway-3c32">blog post on Dev.to</a></p>
<h2 id="about">About</h2>
<p>Netlify's Git Gateway gives your site's Netlify Identity users access to your connected Github Repo. This allows applications to read from and write files to the repo on your user's behalf. This is perfect for creating a small CMS to power a SPA or Static Site Generator, just like Netlify did with Netlify CMS. This example uses a Github Repo, but I'm sure it can be adjusted to work with Gitlab.</p>
<h2 id="automaticsetup">Automatic set-up</h2>
<p>Clicking the button below will automatically clone this repo to your own Github account, create a new Netlify website and configure Netlify Identity and Git Gateway. It's that simple!</p>
<p><a href="https://app.netlify.com/start/deploy?repository=https://github.com/dashpilot/netlify-identity-git-gateway&amp;stack=cms"><img src="https://www.netlify.com/img/deploy/button.svg"></a></p>
<h2 id="manualsetup">Manual Set-up</h2>
<p>If you prefer to set it up manually:</p>
<ol>
<li>Include the Netlify Identity Widget and Github.js in your project</li>
<li>Connect your Github repo to Netlify</li>
<li>Enable Netlify Identity for your site (https://app.netlify.com/sites/git-gateway/identity)</li>
<li>Enable Git Gateway and generate access token (https://app.netlify.com/sites/git-gateway/settings/identity#services)</li>
<li>Done! If you log in with the Netlify Identity Widget, your logged in user will have access to the Github Repo</li>
</ol>
<h2 id="functions">Functions</h2>
<p>The example consists of two functions:</p>
<h3 id="getdatapath">getData(path='')</h3>
<p>If no parameter is provided, this function lists the contents of the repo. If you provide a path, it lists the contents of that one file.</p>
<pre><code>getData('README.md').then(function(result) {
    console.log(result.content)
});
</code></pre>
<h3 id="savedatapathdata">saveData(path, data);</h3>
<p>Saves the data to the provided path. If the file already exists, it overwrites it, else it creates a new file. The data can be any string: text, stringified json or a base64 image.</p>
<pre><code>saveData('README.md', 'String to save').then(function(result) {
    console.log(result)
});
</code></pre>
<h2 id="pressthestarbutton">Press the :star: button</h2>
<p>Don't forget to press the :star: button to let me know I should continue improving this project</p>