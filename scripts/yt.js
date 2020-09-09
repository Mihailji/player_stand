/*------------------------- TESTING AREA -------------------------*/
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var plYT;
function onYouTubeIframeAPIReady() {
  plYT = new YT.Player('player', {
    height: '500',
    width: '500',
    videoId: 'B1JMYoRu04k',
    events: {
      'onStateChange': plr.answer
    },
    playerVars: {'origin':'http://localhost'}
  });
}
