'use strict';

const APFactory = require('./lib/factories.js').ArgumentParserFactory;
const PropertiesReader = require('properties-reader');

const prop = PropertiesReader('.properties');

const parser = new APFactory().create()

    .addSubparsers({title: 'Possible commands',})

    .addSubparser('clean', {dest: 'clean', help: 'Slack subcommand for cleaning', addHelp: true})

    .addArgument(['-c', '--channel'], {
        help: 'ID of the Slack channel', metavar: 'CHANNEL_ID', required: true
    }).addArgument(['-t', '--token'], {
        help: 'Slack access token', metavar: 'SLACK_TOKEN'
    }).addArgument(['-u', '--user'], {
        help: 'ID of the Slack user', metavar: 'USER_ID'
    }).addArgument(['-d', '--delay'], {
        help: 'Delay between requests in ms, should be at least 100 ms', metavar: 'MILLIS'
    }).addArgument(['-s', '--staging'], {
        help: 'Enable testing environment', metavar: 'BOOLEAN'
    }).addArgument(['-p', '--private'], {
        help: 'Enable if channel is private', metavar: 'BOOLEAN'
    })

    .and().addSubparser('send', {help: 'Slack subcommand for sending', addHelp: true})

    .build();

let _args = parser.parseArgs();

let _channel = _args.get('channel', undefined);
let _user = _args.get('user', undefined);
let _delay = _args.get('delay', 200);
let _staging = _args.get('staging', false);
let _token = _args.get('token', undefined);
let _isPrivate = _args.get('private', false);

_token = _token === undefined ? prop.get('token') : _token;

if (_token !== undefined && _channel !== undefined) {

    const Channel = require('./lib/classes.js').Channel;
    const c = new Channel(_token, _channel, _delay, _isPrivate);

    c.staging = _staging;

    if (_staging) {
        console.log('\n  WARNING! \tStaging environment is enabled.\n');
    }

    if (_user !== undefined) {
        c.deleteFromUser(_user);
    } else {
        c.deleteAll();
    }

} else {
    parser.error(new Error('argument "-t/--token" and  "-c/--channel" are required.'));
}