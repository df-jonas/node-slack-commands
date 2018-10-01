"use strict";

const ArgumentParser = require('argparse').ArgumentParser;

exports.ArgumentParserFactory = class ArgumentParserFactory {

    constructor(parser = undefined) {
        this._parser = parser;
        this._options = ArgumentParserFactory.getMainOptions();
    }

    create(options = this._options) {
        this._parser = new ArgumentParser(options);
        return this;
    }

    addSubparsers(options) {
        return new exports.ArgumentSubparsersFactory(this, options);
    }

    addArgument(args, options) {
        this._parser.addArgument(args, options);
        return this;
    }

    build() {
        return this._parser;
    }

    static getMainOptions() {
        return {
            version: '1.0.0',
            addHelp: true,
            description: 'Slack-CLI'
        }
    }
};

exports.ArgumentSubparsersFactory = class ArgumentSubparsersFactory {

    constructor(factory, options) {
        this._factory = factory;
        this._subparsers = factory._parser.addSubparsers(options)
    }

    addSubparser(args, options) {
        return new exports.ArgumentSubparserFactory(this, args, options);
    }

    build() {
        return this._factory.build();
    }
};

exports.ArgumentSubparserFactory = class ArgumentSubparserFactory {

    constructor(factory, args, options) {
        this._factory = factory;

        this._subparser = factory._subparsers.addParser(args, options);
    }

    addArgument(args, options) {
        this._subparser.addArgument(args, options);
        return this;
    }

    and() {
        return this._factory;
    }

    break(){
        return this._factory._factory;
    }

    build() {
        return this._factory._factory.build();
    }
};