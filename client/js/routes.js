import Backbone from 'backbone';

const SIRouter = Backbone.Router.extend({
    routes:{
        '': 'home',
        'view/:id': 'showDetail'
    },
    
    home: function(){
        console.log('homePage');
    },
    
    showDetail: function(){
        console.log(arguments);
    }
});

export default SIRouter;