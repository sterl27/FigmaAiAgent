// Helper function to combine CSS and HTML into a single string for API consumption
function _combineCssAndHtml(css: string, html: string): string {
  return `<style>${css}</style>${html}`;
}

/**
 * Sends combined HTML and CSS to the to.design API and returns clipboard data from the response.
 * @param {Object} params - The parameters for the API call.
 * @param {string} params.html - The HTML string to send.
 * @param {string} params.css - The CSS string to send.
 * @returns {Promise<{ clipboardDataFromAPI: string }>} - The clipboard data returned from the API.
 */
async function codeToDesign({ html, css }: { html: string; css: string; }): Promise<{ clipboardDataFromAPI: string; }> {
  const response = await fetch("https://api.to.design/html", {
    body: JSON.stringify({ html: _combineCssAndHtml(css, html), clip: true }),
    headers: {
      "Content-Type": "application/json",
      // Pass the API key as a function argument or retrieve it from a secure config
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_CODE_TO_DESIGN_API_KEY}`,
    },
    // Combine CSS and HTML before sending to the API
    body: JSON.stringify({ html: combineCssAndHtml(css, html), clip: true }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed with status ${response.status}: ${errorText}`);
  }
  // If the API returns JSON, use response.json(), otherwise use response.text()
  let clipboardDataFromAPI: string;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data = await response.json();
    clipboardDataFromAPI = data.clipboardDataFromAPI ?? JSON.stringify(data);
  } else {
    clipboardDataFromAPI = await response.text();
  }
  return { clipboardDataFromAPI };
  return { clipboardDataFromAPI };
}

export default codeToDesign;
