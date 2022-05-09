<p align="left">
    <img alt="logo" src="./res/logo.svg" width="30%">
</p>

# snappy

A website screenshot capture API created with Node & Express using Puppeteer as a headless Chromium browser to take and
process screenshots.

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

```
/snap?url=https://google.com
```


## Options

| Query Key | Example Value              | Required | Description                                                                                            |
|-----------|:---------------------------|:---------|:-------------------------------------------------------------------------------------------------------|
| url       | `https://google.comz       | ✅        | URL or local path of the website to screenshot.                                                        |
| size       | `1920x1080` or `ipgone 5s` | ✅        | Size of the screenshot to take, this can be represented in pixels i.e. 1920x1080 or a [device list](https://github.com/kevva/viewport-list/blob/master/data.json). |


## Ping

