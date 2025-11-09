# Browser Sitemap Generator

A client-side, browser-based tool to crawl a website and generate a valid XML sitemap. This application is built with React, TypeScript, and Tailwind CSS. It also includes a handy `robots.txt` editor.

## Features

- **XML Sitemap Generation**: Creates a valid `sitemap.xml` file based on the crawled pages of a website.
- **Configurable Crawl Depth**: Users can specify how many levels deep the crawler should go from the starting URL.
- **Internal Link Discovery**: Automatically discovers and follows internal links within the same domain.
- **Sitemap Protocol Compliant**:
    - Sets `<loc>` for the page URL.
    - Sets `<priority>` to `0.8` for the homepage and `0.6` for other pages.
    - Sets `<changefreq>` to `weekly`.
    - Includes `<lastmod>` if the `Last-Modified` header is available from the server response.
- **robots.txt Editor**: A simple interface to create and download a `robots.txt` file, with rules to allow/disallow crawlers and an automatic link to the sitemap.
- **Downloadable Files**: Easily download the generated `sitemap.xml` and `robots.txt` files.
- **Real-time Feedback**: Shows the crawling status, number of pages found, and the current URL being checked.
- **Responsive Design**: The UI is fully responsive and works on devices of all sizes.

---

## ⚠️ Important Limitation: CORS Policy

This tool runs **entirely within your web browser**. Due to modern browser security features, specifically the **Cross-Origin Resource Sharing (CORS) policy**, this application cannot fetch data from a website unless that website's server explicitly allows it.

**What this means for you:**

- The sitemap generator will **not work on most websites** (e.g., `google.com`, `github.com`), as they do not permit other websites to request their content directly from a browser.
- You will likely see an error in the browser's developer console related to CORS.
- The tool is best used for **websites you own and control**, where you can configure the server to send the necessary CORS headers (e.g., `Access-Control-Allow-Origin: *`).

This is a fundamental security restriction of web browsers, not a bug in the application.

---

## How to Use

1.  **Enter URL**: Input the full URL of the website you want to crawl (e.g., `https://example.com`).
2.  **Set Crawl Depth**: Choose the depth for the crawl (e.g., a depth of `2` will crawl the homepage, all links on the homepage, and all links on those subsequent pages). A higher number can take much longer.
3.  **Generate Sitemap**: Click the "Generate Sitemap" button to start the process.
4.  **Monitor Progress**: Watch the status indicator to see the crawl progress.
5.  **Download**: Once complete, the generated XML will be displayed. You can then click the "Download sitemap.xml" button.
6.  **(Optional) Edit robots.txt**: Use the `robots.txt` editor to add rules and download the file for your website's root directory.

## Technologies Used

- **Framework**: [React](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: Heroicons
