window.onload = function(){
    var myAudio = document.getElementById("myAudio"),
        btn = document.getElementById("audio_btn"),
        curTime = document.getElementById("curTime"),
        total = document.getElementById("duration"),
        play = document.getElementById("playbar"),
        rate = document.getElementById("rate"),
        ratebar = document.getElementById("ratebar"),
        lop = document.getElementById("loop"),
        silent = document.getElementById("a_silent"),
        control = document.getElementsByClassName("controls")[0],
        volume = document.getElementById("volume"),
        slidebar = document.getElementById("slidebar"),
        vol_bar = document.getElementById("volbar");


    //播放下一首，上一首
    var prev = document.getElementById("pre");
    var next = document.getElementById("next");
    var message = document.getElementById("message");
    var text = message.getElementsByTagName("p")[0];
    var dataSrc ={data:[{"src":"1.mp3","title":"陈奕迅-白玫瑰","text":"1.陈奕迅-白玫瑰"},
            {"src":"2.mp3","title":"陈坤-蔷薇刑","text":"2.陈坤-蔷薇刑"},
            {"src":"3.mp3","title":"陈奕迅-好久不见","text":"3.陈奕迅-好久不见"}]
    };

    myAudio.src = "audio/" + dataSrc.data[0].src;
    myAudio.title = dataSrc.data[0].title;
    text.innerHTML = dataSrc.data[0].text;

    var i=0;
    next.onclick = function(){
        if(i===2){
            myAudio.src = "audio/" + dataSrc.data[0].src;
            myAudio.title = dataSrc.data[0].title;
            text.innerHTML= dataSrc.data[0].text;
            i = -1;
        }
        myAudio.src = "audio/" + dataSrc.data[i+1].src;
        myAudio.title = dataSrc.data[i+1].title;
        text.innerHTML= dataSrc.data[i+1].text;
        total.innerHTML = "00:00";
        i+=1;
        btn.getElementsByTagName("img")[0].src="image/pause.png";
    };
    prev.onclick = function(){
        if(i===0){
            myAudio.src = "audio/" + dataSrc.data[2].src;
            myAudio.title = dataSrc.data[2].title;
            text.innerHTML= dataSrc.data[2].text;
            i=3;
        }
        myAudio.src = "audio/" + dataSrc.data[i-1].src;
        myAudio.title = dataSrc.data[i-1].title;
        text.innerHTML= dataSrc.data[i-1].text;
        total.innerHTML = "00:00";
        i-=1;
        btn.getElementsByTagName("img")[0].src="image/pause.png";
    };


    //调节音量
    myAudio.volume = 0.6;
    var vol_ratio = myAudio.volume * volume.clientWidth + "px";
    vol_bar.style.width = vol_ratio;
    slidebar.style.left = vol_ratio;
    vol_bar.style.backgroundColor = "#000";       //初始化音量

    var statu = false;        //音量进度条拖动
    var disX;
    var apX = [{x:slidebar.offsetLeft}];
    slidebar.onmousedown = function(event){
        var event = event || window.event;
        statu = true;
        disX = event.clientX - slidebar.offsetLeft;
        apX.push({x:slidebar.offsetLeft});
        return false;
    };
    slidebar.onmousemove = function(event){
        if(statu){
            var event = event || window.event;
            var il = event.clientX - disX;
            if(il < 0){
                il = 0;
            }
            if(il > 60){
                il = 60;
            }
            slidebar.style.left = il + "px";
            vol_bar.style.width = il + "px";
            apX.push({x:il});
            myAudio.volume = il / volume.clientWidth;
            return false;
        }
    };
    document.onmouseup = function(){
        statu = false;
    };
    volume.onclick = function(event){
        var event = event || window.event;
        if(!statu){
            var il = event.clientX - disX;
            if(il < 0){
                il = 0;
            }
            if(il > 60){
                il = 60;
            }
            slidebar.style.left = il + "px";
            vol_bar.style.width = il + "px";
            myAudio.volume = il / volume.clientWidth;
        }
    };


    //设置静音
    myAudio.muted = false;
    silent.onclick = function(){
        if(myAudio.muted){
            myAudio.muted = false;
            silent.style.opacity = 1;
            silent.getElementsByTagName("img")[0].src = "image/volume.png";
        }else {
            myAudio.muted = true;
            silent.style.opacity = 0.3;
            silent.getElementsByTagName("img")[0].src = "image/silent.png";
        }
    };

    //设置循环
    myAudio.loop = true;
    lop.onclick = function(){
        if(myAudio.loop) {
            myAudio.loop = false;
            lop.style.opacity = 0.4;
        }else {
            myAudio.loop = true;
            lop.style.opacity = 1;
        }
    };

    //播放与暂停按钮
    btn.onclick = function() {
        if(myAudio.paused) {
            myAudio.play();
            btn.getElementsByTagName("img")[0].src="image/play.png";
        }else{
            myAudio.pause();
            btn.getElementsByTagName("img")[0].src="image/pause.png";
        }
        var duration1 = myAudio.duration;
        total.innerHTML = progress(duration1);
    };


    //播放时间进度
    setInterval(function() {
        var curTime1 = myAudio.currentTime;
        curTime.innerHTML = progress(curTime1);
        rates();
    }, 1000);

    //时间转换
    function progress(time) {
        var m = parseInt(time/60),
            s = parseInt(time%60);
        m = m < 10 ? "0"+m : m;
        s = s < 10 ? "0"+s : s;
        return m+":"+s;
    }

    function rates() {
        var ratio = myAudio.currentTime / myAudio.duration * 100 + "%";
        rate.style.width = ratio;
        ratebar.style.left = ratio;
        rate.style.backgroundColor = "#000";
    }
};
