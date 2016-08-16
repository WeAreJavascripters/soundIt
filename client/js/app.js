import Backbone from 'backbone';
import SIRouter from './routes.js';
import Recorder from './modules/recorder/recorder.js';

new SIRouter();
Backbone.history.start();
Recorder.initialize();

//siRoute.navigate("", {trigger: true});
//siRoute.navigate("view/7", {trigger: true});
//siRoute.navigate("", {trigger: true});

