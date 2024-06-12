<div align="center">

# Index-san (alpha)

<img src="./logo.ico" height="200" />

Notes app + Filesystem API for modern web

[App](https://app.index-san.dev) -
[Docs](https://index-san.dev) -
[Support](https://github.com/sponsors/zzhenryquezz)

</div>

## About

This app is a Web application using the latest browser API for folders & files manipulation, the [FileSystem API](https://developer.chrome.com/docs/capabilities/web-apis/file-system-access).

The goal of this project is to be a modern **notes + filesystem app**, with tools to manipulate and present data in a flexible way to allow users to manipulate and present data in a way that is not possible with traditional notes apps.

Examples of what we would like to achieve:

- Read a csv file and a line chart
- Read multiple files with different formats and show they in a unique line chart.
- Press a button and make requests to an bunch of APIs at same time.
- Run scripts from time to time to update data (like a queue).
- Have a internal database that can auto-update with data from an API, like an stocks API.

You can test the app right now if you wish, there is no need for installation or sign-up

[https://app.index-san.dev](https://app.index-san.dev)

> warning: The app is in alpha version, so it can have bugs and some features can be missing or not working properly.

## Setup

Install dependencies

```bash
npm install // install root dependencies

npm install -ws // install packages dependencies

npm -w ui run dev // Run ui vue app
```


