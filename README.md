# TC Friends

An app for pets!

## Getting up and running

### Installing MongoDB via Homebrew

```bash
$ brew update
$ brew install mongodb
```

### Install dependencies
  
```bash
$ npm install
```

### Start it up

```bash
$ node app.js
$ mongod
```

Open up [http://localhost:3000](http://localhost:3000) in your browser.

_You might run into an issue where `mongod` fails. [This article](https://wesleytsai.io/2015/07/26/mongodb-server-directory-permission-denied/) might help._

## Adding Environment Variables

Add a `.env` file to the project root, then add your variables on individual lines. You may need to restart your server for the changes to take effect.

**Example**

```
petKey=123456789abcdefghijklmopqrstuvwxyz
mailUser=sendingemail@domain.com
```
