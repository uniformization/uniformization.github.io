async function inject(element, url) {
  var htmlData = null;
  var stylesheetUrl = null;

  try {
    const response = await fetchJsonp(url);
    if (!response.ok) {
      throw new Error('Failed to fetch gist, status: ' + response.status);
    }

    const json = await response.json();
    let div = json['div'];
    let stylesheet = json['stylesheet'];

    if (div == null || stylesheet == null) {
      throw new Error('Invalid JSON response for gist');
    }

    htmlData = div;
    stylesheetUrl = stylesheet;
  } catch (error) {
    // todo: show an error message
    console.error(error.message);
    return;
  }

  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = stylesheetUrl;

  const head = document.getElementsByTagName('head')[0];
  head.appendChild(stylesheet);

  element.innerHTML = htmlData;
}

window.onload = async () => {
  for (const injection of injections) {
    const element = document.getElementById(injection.id);
    await inject(element, injection.src);
  }
};
