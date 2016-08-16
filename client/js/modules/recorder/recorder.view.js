import Backbone from 'backbone';
import tpl from './recorder.tpl.js';
import SoundItRecorder from '../audio/soundItRecorder.js';
import PlayerView from './player.view.js';

const RecorderView = Backbone.View.extend({

    el: '#recorder-container',

    events: {
        'click #record': 'record',
        'click #stop-recording': 'stopRecording',
        'click #delete': 'delete',
    },

    tpl,

    initialize: function () {
        this.playerView = new PlayerView();
        this.render();
        this.getElements();
        this.soundItRecorder = new SoundItRecorder();
        this.displayAudioElement();
        this.listenTo(Backbone.Events, 'displayAudioControls', this.ready);
    },

    getElements: function () {
        this.recordButton = this.$('#record');
        this.stopRecordingButton = this.$('#stop-recording');
        //this.playButton = this.$('#play');
        //this.stopPlayingButton = this.$('#stop-playing');
        this.deleteButton = this.$('#delete');
        this.audioContainer = this.$('#audio-container');
        this.loading = this.$('#loading');
    },

    displayAudioElement: function () {
        this.audioContainer.html(this.playerView.$el);
    },

    render: function () {
        this.$el.html(this.tpl());
        this.$('#audio-container').html(this.playerView.$el);
        return this;
    },

    record: function () {
        this.soundItRecorder.startRecording();
        this.hide(this.recordButton);
        this.show(this.stopRecordingButton);
    },

    stopRecording: function () {
        this.soundItRecorder.stopRecording();
        this.hide(this.stopRecordingButton);
        this.show(this.loading);
    },

    ready: function (event) {
        this.playerView.setAudio(event.data.data);
        this.hide(this.loading);
        this.show(this.audioContainer);
        //this.show(this.playButton);
        this.show(this.deleteButton);
    },

    play: function () {
        //this.hide(this.playButton);
        //this.show(this.stopPlayingButton);
    },

    stopPlaying: function () {
        //this.hide(this.stopPlayingButton);
        //this.show(this.playButton);
    },

    delete: function () {
        //this.hide(this.playButton);
        //this.hide(this.stopPlayingButton);
        this.hide(this.audioContainer);
        this.hide(this.deleteButton);
        this.show(this.recordButton);
    },

    show: function (el) {
        el.removeClass('hidden');
    },

    hide: function (el) {
        el.addClass('hidden');
    }

});

export default RecorderView;
