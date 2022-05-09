<p align="left">
    <img alt="logo" src="./res/logo.svg" width="30%">
</p>

# snappy

A website screenshot capture API created with Node & Express using Puppeteer as a headless Chromium browser to take and
process screenshots. Credits to [Pageres](https://github.com/sindresorhus/pageres)

![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)
![Typescript](https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat)
![Made with Express](https://img.shields.io/badge/Made%20with-Express-brightgreen.svg?&style=flat)
[![Twitter](https://img.shields.io/twitter/follow/ainsleydev)](https://twitter.com/ainsleydev)

## Overview

- 🖥️ Control the size of the screenshot to take by pixels or device.
- 🖼️ Crop the screenshot to a set height from the top of the viewport.
- 🙈 Hide a collection of DOM elements matching CSS selectors.
- 🎛️ Apply custom CSS & Javascript to the web page.
- 📸 Many other settings including scale, user agent selection & dark mode.

## Examples

Snap a URL with a size of `1920x1080`

```
/snap?url=https://google.com&size=1920x1080
```


Snap a URL with the height set (crop) and serve the images fresh (no cache). 

```
/snap?url=https://google.com&size=1920x1080&ignoreCache=true
```

Snap a URL and hide specific DOM elements (with a comma delimited list).

```
/snap?url=https://google.com?hide=h1,img
```

Snap a URL with a specific user agent.

```
/snap?url=https://google.com?userAgent=AdsBot-Google
```

Snap a URL and emulate preference of a dark color scheme.

```
/snap?url=https://google.com?darkMode: true
```


## Options

Below are the options represented as query parameters you can pass to the `/snap` endpoint.

| Query Key    | Default    | Required | Description                                                                                                                                                        |
|--------------|:-----------|:---------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| url          |            | ✅        | URL or local path of the website to screenshot.                                                                                                                    |
| size         | `1366x768` |          | Size of the screenshot to take, this can be represented in pixels i.e. 1920x1080 or a [device list](https://github.com/kevva/viewport-list/blob/master/data.json). |
| ignoreCache  | `false`    |          | If the cache should be ignored when processing the screenshot.                                                                                                     |
| rebuildCache | `false`    |          | If the cache is to be rebuilt.                                                                                                                                     |
| delay        | `false`    |          | Delay capturing the screenshot. Useful when the site does things after load that you want to capture.                                                              |
| crop         | `true`     |          | Crop to the set height.                                                                                                                                            |
| css          |            |          | Apply custom CSS to the webpage.                                                                                                                                   |
| script       |            |          | Apply custom JavaScript to the webpage.                                                                                                                            |
| selector     |            |          | Capture a specific DOM element matching a CSS selector.                                                                                                            |
| hide         |            |          | Hide an array of DOM elements matching CSS selectors.                                                                                                              |
| scale        | 1          |          | Scale webpage `n` times.                                                                                                                                           |
| userAgent    | 1          |          | Custom user agent.                                                                                                                                                 |
| transparent  | false      |          | Set background color to `transparent` instead of `white` if no background is set.                                                                                  |
| darkMode     | false      |          | Emulate preference of dark color scheme.                                                                                                                           |


## Ping

