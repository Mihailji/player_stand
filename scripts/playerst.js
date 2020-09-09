$(function(){
  /*------------------------------------playerObject------------------------------------*/
  function PlSt(){
    var player=this;
    var songName=null;
    var moveSpeed=null;
    var custX=coords("cust");
    var songX=coords("song");
    var barrelAnim=null;
    var custTmrs=new Tmrs();
    var songTmrs=new Tmrs();
    var custKeys=new Keys();
    var songKeys=new Keys();
    function coords(targ){
      var style = window.getComputedStyle(document.getElementById(targ + "F1"));
      var matrix = new WebKitCSSMatrix(style.webkitTransform);
      return matrix.m41;
    }
    function Tmrs(){
      this.barrel1=null;
      this.spring1=null;
      this.spring2=null;
    };
    function Keys(){
      this.move=["0%","100%"];
      this.moveFirst=["0%","50%","100%"];
    }
    function initSongCust(){
      function clearT(x){
        clearTimeout(x.barrel1);
        clearTimeout(x.spring1);
        clearTimeout(x.spring2);
      }
      clearT(custTmrs);
      clearT(songTmrs);
      $(".cls-1").removeAttr("style");
      $(".cls-1").removeClass().addClass("cls-1");
    }
    function fadeInText(){
      $(".cls-1").css({opacity: 1});
    }
    function fadeOutText(){
      $(".cls-1").css({opacity: 0});
    }
    this.setSongName=function (songName,custName){
      this.songName=songName;
      this.moveSpeed=moveSpeed;
      console.log(this.songName);
      moveSpeed=35;
      dispWidth=600-(songX*2);
      barrelFrame=640;
      dispWidthCust=600-(songX*2);
      barrelFrameCust=640;
      initSongCust();
      setText(songName,moveSpeed,"song",dispWidth,barrelFrame,songX,songKeys,songTmrs);
      setText(custName,moveSpeed,"cust",dispWidthCust,barrelFrameCust,custX,custKeys,custTmrs);
      fadeInText();
    }
    function setText(text,moveSpeed,targ,dispWidth,barrelFrame,targX,keys,timers){
      $("#"+ targ +"F1, #"+ targ +"M1, #"+ targ +"D1").html(text);
      var targBox = $("#"+ targ + "F1")[0].getBoundingClientRect();
      var targF=$("#"+ targ +"F1");
      var targM=$("#"+ targ +"M1");
      var targD=$("#"+ targ +"D1");
      k=1.66661;
      desider(targ,moveSpeed);
      function findKeyframesRule(rule) {
        var ss = document.styleSheets;
        for (var i = 0; i < ss.length; ++i) {
          for (var j = 0; j < ss[i].cssRules.length; ++j) {
            if (ss[i].cssRules[j].type == 7 &&
            ss[i].cssRules[j].name == rule) {
              return ss[i].cssRules[j]; }
          }
        }
        return null;
      }
      function deleteRules(ruleName,keys){
        var keyframes=findKeyframesRule(ruleName);
        for (i = 0; i < keys.length; i++){
          keyframes.deleteRule(keys[i]);
        }
        return keyframes;
      }
      function setMoveSpring(moveSpeed){
        let keyframes=deleteRules(targ +"Move",keys.move);
        var offsetLeft=20;
        var offsetRight=targBox.width-dispWidth+offsetLeft;
        keyframes.appendRule("0%" + " {transform:translateX("+ (targX-offsetRight) +"px);}");
        keyframes.appendRule("100%" + " {transform:translateX("+ (targX+offsetLeft) +"px);}");
        targF.addClass("FSpring");
        timers.spring1=setTimeout(function(){
          targF.css("transform","translateX("+ (targX-offsetRight) +"px)");//стартовая строка
          timers.spring2=setTimeout(function(){
            targF.addClass("FMSpring").removeClass("FSpring");//продолжение анимации
            targF.css({"animation-name" : targ +"Move"});
          },5500);
        },1000);
      }
      function setMoveBarrel(moveSpeed,exDelay){
        let keyframes=deleteRules(targ +"Move",keys.move);
        namePlusSpace=targBox.width+30;// + отступ между бегущими строками
        targM.css("transform", "translateX("+ (targX+namePlusSpace) +"px)");//set to init position
        targD.css("transform", "translateX("+ (targX+namePlusSpace) +"px)");
        keyframes.appendRule("0%" + " {transform:translateX("+ (targX+namePlusSpace) +"px);}");
        keyframes.appendRule("100%" + " {transform:translateX("+ (targX-namePlusSpace) +"px);}");
        var timeCalc=(namePlusSpace*2)/moveSpeed; //VAR important!
        timers.barrel1=setTimeout(function(){
          targM.css({"animation-duration" : timeCalc + "s","animation-delay" : exDelay + "s","animation-name" : targ +"Move"});
          targD.css({"animation-duration" : timeCalc + "s","animation-delay" : (exDelay+(timeCalc/2)) + "s","animation-name" : targ +"Move"});
          targF.css("animation-name", targ +"MoveFirst");
        },1000);
      }
      function setMoveBarrelFirst(moveSpeed,dispWidth,k){
        let keyframes=deleteRules(targ +"MoveFirst",keys.moveFirst);
        namePlusSpace=targBox.width+30;// + отступ между бегущими строками
        distBezier1x=barrelFrame-dispWidth;//минимальная дистанция для разгона строки
        distLinear=namePlusSpace-distBezier1x;
        distLinearPr=distLinear/(distBezier1x*k);
        timeLinear=distLinear/moveSpeed;
        timeBezier=timeLinear/distLinearPr;
        timeCalc=timeBezier+timeLinear;
        percBezier=100/(distLinearPr+1);

        exDelay=timeBezier-distBezier1x/moveSpeed;
        keyframes.appendRule("0%" + " {transform:translateX("+ targX +"px);animation-timing-function: cubic-bezier(0.4, 0, 1, 1);}");
        keys.moveFirst[1]=percBezier+"%";
        keyframes.appendRule(percBezier+"%" + " {transform:translateX("+ (targX-distBezier1x) +"px);animation-timing-function: linear;}");
        keyframes.appendRule("100%" + " {transform:translateX("+ (targX-namePlusSpace) +"px);}");
        targF.css({"animation-duration" : timeCalc + "s"});
        targF.addClass("FBarrel");
        targM.addClass("MBarrel");
        targD.addClass("DBarrel");
        setMoveBarrel(moveSpeed,exDelay);
      }
      function desider(targ,moveSpeed){
        if (targBox.width >= dispWidth){
          if (targBox.width >= barrelFrame){
            setMoveBarrelFirst(moveSpeed,dispWidth,k);
          }else{
            setMoveSpring(moveSpeed);
          }
        }else{
          var centWidth=(dispWidth-targBox.width)/2;
          targF.css("transform","translateX("+ (targX+centWidth) +"px)");
        }
      }
    }
    /*------------------------------------ratingBar------------------------------------*/
    this.rate=(l,d)=>{
      this.rating.rate(l,d);
    }
    this.rating=new function (){
      var likeAnim=false;
      var dislikeAnim=false;
      var sumLike=0;
      var sumDislike=0;
      var rateLength = 597;
      var rateBar=document.getElementById('rateBar_fill');
      this.rate=(like,dislike)=>{
        if (like!==0){
          animGest(".cls-26",likeAnim,function(){likeAnim=false});
        }
        if (dislike!==0){
          animGest(".cls-27",dislikeAnim,function(){dislikeAnim=false});
        }
        setRate(like,dislike);
      }
      function animGest(gest,gestAnim,chngAnim){
        if (!gestAnim){
          $(gest).css({"opacity":"1","transition":"0.1s"});
          setTimeout(function (){
            $(gest).css({"opacity":"0.4","transition":"0.5s"});
            chngAnim();
          },300);
          return true;
        }
      }
      function setRate(like,dislike){
        sumLike=sumLike+like;
        sumDislike=sumDislike+dislike;
        let l=rateLength * sumLike/(sumLike + sumDislike);
        let r=rateLength-l;
        rateBar.setAttribute("stroke-dasharray", l +" "+ r);
        document.getElementById('likeNum').innerHTML=sumLike;
        document.getElementById('dislikeNum').innerHTML=sumDislike;
      }
      this.reSet=()=>{
        function reTime(){
          rateBar.style.cssText="";
        }
        rateBar.removeEventListener("transitionend",reTime,{once: true});
        rateBar.style.transition="stroke-dasharray 0.4s";
        sumLike=0;
        sumDislike=0;
        document.getElementById('likeNum').innerHTML=0;
        document.getElementById('dislikeNum').innerHTML=0;
        let x=(rateLength/2);
        rateBar.setAttribute("stroke-dasharray", x +" "+ x);
        rateBar.addEventListener("transitionend",reTime,{once: true});
      }
    }
    /*------------------------------------progressBar------------------------------------*/
    this.progress=new function(){
      var progLength=598;
      var fract;
      var progBar=document.getElementById('progBar_fill');
      var minNum=document.getElementById('min');
      var secNum=document.getElementById('sec');
      var dur;
      var rAF;
      function c10(n){
        if(n<10){
          return "0"+n;
        }
        return n;
      }
      function fill(){
        let eT=plYT.getCurrentTime();
        let l=fract*eT;
        let r=progLength-l;
        progBar.setAttribute("stroke-dasharray", l +" "+ r);
        let mins=Math.floor(eT / 60);
        minNum.innerHTML=c10(mins);
        secNum.innerHTML=c10(Math.floor(eT - mins * 60));
        rAF=requestAnimationFrame(fill);
      }
      this.calc=()=>{
        dur=plYT.getDuration()-1;
        fract=progLength/dur;
        var minNum=document.getElementById('minS');
        var secNum=document.getElementById('secS');
        let mins=Math.floor(dur / 60);
        minNum.innerHTML=c10(mins);
        secNum.innerHTML=c10((dur - mins * 60).toFixed(0));
        fill();
      }
      this.reSet=(resolve)=>{
        function reTime(){
          progBar.style.cssText="";
          resolve();
        }
        cancelAnimationFrame(rAF);
        progBar.removeEventListener("transitionend",reTime,{once: true});
        progBar.style.transition="stroke-dasharray 0.4s";
        $(".timer0").html("00");
        progBar.setAttribute("stroke-dasharray", "0 "+ progLength);
        progBar.addEventListener("transitionend",reTime,{once: true});
      }
    }
    /*------------------------------------settingFunctions------------------------------------*/
    function reSetBars(resolve,reject){
      player.progress.reSet(resolve);
      player.rating.reSet();
      fadeOutText();
    }
    this.customer="";
    this.answer=(event)=>{
      console.log(event.data);
      if (event.data==1){
        player.setSongName(plYT.getVideoData().title,this.customer);
        this.progress.calc();
      }
    }
    this.playYT=async function(id,customer){
      await new Promise(function (resolve,reject){reSetBars(resolve,reject);});
      this.customer=customer;
      plYT.loadVideoById({videoId:id});
    }
  }
  /*------------------------------------playerObject------------------------------------*/

  window.plr=new PlSt();
  $("#setSong").click(function (){
    plr.playYT("uIB4ISIGMZE","Violet Rage");
  });

  $("#setSong2").click(function (){
    plr.playYT("XfR9iY5y94s","Алексей");
  });

  $("#setSong3").click(function (){
    plr.playYT("P-gCoEVwZXs","Alien");
  });

  $("#setSong4").click(function (){
    plr.playYT("ZhIsAZO5gl0","Gene Simmons");
  });

  $("#like").click(function (){
    plr.rate(1,0);
  });

  $("#dislike").click(function (){
    plr.rate(0,1);
  });
/*  var tmrs=4000;
  setTimeout(()=>{plr.playYT("P-gCoEVwZXs","Алексей");},tmrs);
  tmrs=tmrs+4000;
  setTimeout(()=>{plr.rate(1,0);},tmrs);
  tmrs=tmrs+4000;
  setTimeout(()=>{plr.rate(0,1);},tmrs);
  tmrs=tmrs+2000;
  setTimeout(()=>{plr.rate(0,1);},tmrs);
  tmrs=tmrs+4000;
  setTimeout(()=>{plr.rate(1,0);},tmrs);
  tmrs=tmrs+4000;
  setTimeout(()=>{plr.rate(1,0);},tmrs);
  tmrs=tmrs+4000;
  setTimeout(()=>{plr.rate(1,0);},tmrs);
  tmrs=tmrs+5000;
  setTimeout(()=>{plr.playYT("ZhIsAZO5gl0","Gene Simmons");},tmrs);
  tmrs=tmrs+4000;
  setTimeout(()=>{plr.rate(1,0);},tmrs);
  tmrs=tmrs+4000;
  setTimeout(()=>{plr.rate(0,1);},tmrs);
  tmrs=tmrs+2000;
  setTimeout(()=>{plr.rate(0,1);},tmrs);
  tmrs=tmrs+1000;
  setTimeout(()=>{plr.rate(1,0);},tmrs);
  tmrs=tmrs+1000;
  setTimeout(()=>{plr.rate(1,0);},tmrs);
  tmrs=tmrs+4000;
  setTimeout(()=>{plr.rate(1,0);},tmrs);
  tmrs=tmrs+4000;
  setTimeout(()=>{plr.rate(1,0);},tmrs);
  tmrs=tmrs+4000;
  setTimeout(()=>{plr.rate(0,1);},tmrs);
  tmrs=tmrs+2000;
  setTimeout(()=>{plr.rate(0,1);},tmrs);
  tmrs=tmrs+4000;
  setTimeout(()=>{plr.rate(1,0);},tmrs);
  tmrs=tmrs+4000;
  setTimeout(()=>{plr.rate(1,0);},tmrs);
  tmrs=tmrs+4000;
  setTimeout(()=>{plr.rate(1,0);},tmrs);
  tmrs=tmrs+2000;
  setTimeout(()=>{plr.rate(6,0);},tmrs);
  tmrs=tmrs+2000;
  setTimeout(()=>{plr.rate(6,0);},tmrs);*/
});
