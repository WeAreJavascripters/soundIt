var siRoute = new SIRouter();
Backbone.history.start();

siRoute.navigate("", {trigger: true});
siRoute.navigate("view/7", {trigger: true});
//siRoute.navigate("", {trigger: true});