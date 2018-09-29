# TiebaSign

[![Build Status](https://travis-ci.org/bluelovers/tieba-sign.svg?branch=master)](https://travis-ci.org/bluelovers/tieba-sign)

> sign tieba in command line

## Installation

```bash
$ npm i tieba-sign2 -g
```

## Usage

### Basic

```bash
# set cookie
$ tieba-sign cookie <bduss>
# sign
$ tieba-sign
```

或者 以以下指令代替 將會同時設定 cookies 與 進行簽到

```bash
# set cookie & sign
$ tieba-sign --cookie <bduss>
```

### All Commands

Command | Description
------- | -----------
tieba-sign cookie | save cookie locally
tieba-sign | sign
tieba-sign -s | skip cache and sign
tieba-sign clear | clear stored data, including cookie

## License

MIT &copy; [fengzilong](https://github.com/fengzilong)
