#!/usr/bin/env node
import yargs = require('yargs');
export interface IArgv extends yargs.Argv {
    useGlobalCache?: boolean;
    skipCache?: boolean;
    bduss?: string;
    hideUser?: boolean;
    cookie?: string;
}
