
var Service = (function(){

    // https://www.googleapis.com/youtube/v3/search?key=AIzaSyAXrOaIA3FiZ_Qp76WIZmU67zNV4mriEkU&channelId=UCVKdSP47XahRYJpvfA7inmg&part=snippet,id&order=date&maxResults=20
    var populateFn = {
        youtubeAPI : {
            url : 'https://www.googleapis.com/youtube/v3/search?key=AIzaSyAXrOaIA3FiZ_Qp76WIZmU67zNV4mriEkU&channelId=UCVKdSP47XahRYJpvfA7inmg&part=snippet,id&order=date&maxResults=20',
            parameters : {
                tags : false,
                content_name : false,
                session_id : false,
                taxonomy : false,
                content_type: false,
                content_subtype: false,
                websiteid : function(){ return this.coreVars("website")},
                lang: function(){ return this.coreVars("language")}
            }
        },
        twitterAPI : {
          url: 'http://twitter.com',
          parameters: {
            
          }
        }
    };


    var Service = function(){

        var populatedThis = this.populateAPI.bind(this);

        populatedThis(populateFn);

    };

    Service.prototype = new Core;

    return Service;

})();

window['jsonp_callback1'] = function() {

}
