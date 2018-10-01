"use strict";

const request = require('sync-request');
const sleep = require('system-sleep');

exports.Channel = class Channel {

    constructor(token, channel, delay, isPrivate) {
        this.privateChannel = isPrivate;
        this.channelApi = this.privateChannel ? 'groups' : 'channels';
        this.baseApiUrl = 'https://slack.com/api/';
        this.historyApiUrl = this.baseApiUrl + this.channelApi + '.history?token=' + token + '&count=1000&channel=' + channel;
        this.deleteApiUrl = this.baseApiUrl + 'chat.delete?token=' + token + '&channel=' + channel + '&ts=';
        this.delay = delay;
        this.staging = false;
        let res = request('GET', this.historyApiUrl);
        this.response = JSON.parse(res.getBody());
        this.messages = this.response.messages;
    };

    getMessages() {
        return this.messages;
    }

    deleteAll() {
        let collection = this.getMessages();
        this.handleDeleteEvent(collection);
    }

    deleteFromUser(user_id) {
        let collection = this.getMessages().filter(x => x.user === user_id);
        this.handleDeleteEvent(collection);
    }

    handleDeleteEvent(collection) {
        let msg = collection.shift();

        while (msg !== undefined && (!msg.hasOwnProperty("trials") || msg.trials <= 20)) {
            let isSuccess = this.deleteMessage(msg);

            if (!isSuccess) {
                msg.hasOwnProperty("trials") ? msg.trials++ : msg.trials = 1;
                this.messages.push(msg);
            }

            sleep(this.delay);

            msg = this.messages.shift();
        }
    }

    deleteMessage(message) {
        if (message == null || message === undefined) {
            return true;
        }

        if (!this.staging) {
            let res = request('GET', this.deleteApiUrl + message.ts);

            if (res.statusCode === 200) {
                console.log('Deleted message: "' + message.text + '"');
                return true
            } else {
                console.log('Message not deleted, retrying later.');
                return false;
            }
        } else {
            console.log('[staged] Deleted message: "' + message.text + '"');
            return true;
        }
    };
};