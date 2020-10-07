[![npm version](https://badge.fury.io/js/kerberos-cli.svg)](https://badge.fury.io/js/kerberos-cli)
[![Build Status](https://travis-ci.org/kerberos-cli/kerberos-cli.svg?branch=master)](https://travis-ci.org/kerberos-cli/kerberos-cli)

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/kerberos-cli/kerberos-cli/blob/master/LICENSE)
[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg)](https://github.com/996icu/996.ICU/blob/master/LICENSE)

# Kerberos Cli

Kerberos, a mono-repo workspace tool. It mainly provides a workspace for developers to manage simultaneous development of multiple GIT repositories. Kerberos uses YARN WORKSPACE to manage dependencies, and it only provides more shortcuts to manipulate each git repository (cloning projects, adding projects, upgrading versions, etc.) to complete the entire development process.

## Install

```bash
$ npm i -g kerberos-cli
# or
$ yarn global add kerberos-cli
$ kerberos-cli -v
$ kerber -v
```

## Quick Overview

```bash
$ kerbe init my-project
```

## Add New Git Repository

```bash
$ kerbe clone <MyGitRepo>
```

## Config

```json
{
  /*
    For version number definitions, please follow Semver's semantic version number rules. For related rules, please refer to https://semver.org/. All sub-project version numbers are subject to this version, and cannot be greater than this version.
   */
  "version": "1.0.0",
  "release": {
    /* Release type, only supports tag */
    "type": "tag",
    /* Specify the release branch, all branches are allowed by default */
    "branch": "master",
    /* Specify git commit information when release */
    "message": "chore(release): Kerberos Tag"
  },
  /* Subprojects
    By default, it has a subproject.
    The @kerberos/doge project is a project for saving configuration information of the workspace.
   */
  "projects": [
    {
      /* The name of subproject
        Please match the name with the name in the package.json file of the subproject.
       */
      "name": "@kerberos/doge",
      /* The name of the workspace where the subproject is located. */
      "workspace": "@kerberos",
      /*
        If true, it will not be installed automatically when the ʻinstall` command is executed, but an optional installation will be prompted.
       */
      "optional": false
    }
  ]
}
```
