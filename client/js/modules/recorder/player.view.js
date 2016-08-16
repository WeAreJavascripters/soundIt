import Backbone from 'backbone';
import tpl from './player.tpl.js';

const PlayerView = Backbone.View.extend({

    tagName: 'span',

    tpl,

    events: {
        'click #play': 'play',
        'click #stop': 'stop',
    },

    initialize: function () {
        this.render();
        this.getElements();
    },

    render: function () {
        this.$el.html(this.tpl());
        return this;
    },

    getElements: function () {
        this.playButton = this.$('#play');
        this.stopButton = this.$('#stop');
    },

    setAudio: function (data) {
        var url = URL.createObjectURL(data.blob);
        this.delegateEvents();
        this.audio = new Audio(url);
        this.audio.onended = () => this.stop();
    },

    play: function () {
        this.hide(this.playButton);
        this.show(this.stopButton);
        this.audio.play();
    },

    stop: function () {
        this.show(this.playButton);
        this.hide(this.stopButton);
        this.audio.currentTime = 0;
        this.audio.pause();
    },

    show: function (el) {
        el.removeClass('hidden');
    },

    hide: function (el) {
        el.addClass('hidden');
    }



});

export default PlayerView;
