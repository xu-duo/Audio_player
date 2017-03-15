window.onload = function(){
    var myAudio = document.getElementById("myAudio"),
        btn = document.getElementById("audio-btn"),
        currentTime = document.getElementById("currentTime"),
        totalTime = document.getElementById("totalTime"),
        play = document.getElementById("playBar"),
        rate = document.getElementById("rate"),
        rateBar = document.getElementById("rateBar"),
        lop = document.getElementById("loop"),
        silent = document.getElementById("a-silent"),
        volume = document.getElementById("volume"),
        slideBar = document.getElementById("slide-bar"),
        volBar = document.getElementById("vol-bar");

    var dataSrc ={data: [
        {"src":"1.mp3","title":"白玫瑰-陈奕迅","text":"1. 白玫瑰-陈奕迅"},
        {"src":"2.mp3","title":"蔷薇刑-陈坤","text":"2. 蔷薇刑-陈坤"},
        {"src":"3.mp3","title":"好久不见-陈奕迅","text":"3. 好久不见-陈奕迅"}
    ]};

    //初始化资源
    myAudio.src = "audio/" + dataSrc.data[0].src;
    myAudio.title = dataSrc.data[0].title;

    //加载第一首歌总播放时间
    totalProgress();

    //初始化音量
    myAudio.volume = 0.6;
    var vol_ratio = myAudio.volume * volume.clientWidth + "px";
    volBar.style.width = vol_ratio;
    slideBar.style.left = vol_ratio;
    volBar.style.backgroundColor = "#000";

    var list = document.querySelector('#music-list');
    var texts = list.querySelectorAll('li');

    var currentIndex = ' ';     //用于保存当前选中歌曲index

    for(var i=0 ;i<texts.length;i++){
        texts[i].innerHTML = dataSrc.data[i].text;
        texts[i].index = i;

        texts[i].onclick = function(){

            if(this.index === currentIndex){
                return;
            }else{
                for(var j=0;j<texts.length;j++){
                    texts[j].className = '';
                }

                currentIndex = this.index;
                this.className = "active";

                myAudio.src = "audio/" + dataSrc.data[this.index].src;
                myAudio.title = dataSrc.data[this.index].title;
                state = false;

                playState();
                totalProgress();
            }
        }
    }

    //播放与暂停按钮
    var state = false;      //存储歌曲播放状态
    btn.onclick = function(){
        playState();
    };

    //播放状态
    function playState(){
        if(state){
            myAudio.pause();
            btn.style.background = "url(image/icon.png) -40px -80px no-repeat";
            state = false;
        }else{
            myAudio.play();
            btn.style.background = "url(image/icon.png) 0 -80px no-repeat";
            state = true;
        }
    }

    //歌曲上、下一首切换
    var prev = document.getElementById("pre");
    var next = document.getElementById("next");

    next.onclick = function(){
        changeAudio('next');    //下一首
    };
    prev.onclick = function(){
        changeAudio('prev');    //上一首
    };

    function changeAudio(e){
        var len = dataSrc.data.length;
        switch (e){
            case 'next':
                if (currentIndex === len-1){
                    currentIndex = 0;
                }else{
                    currentIndex++;
                }
                break;
            case 'prev':
                if (currentIndex === 0){
                    currentIndex = len-1;
                }else{
                    currentIndex--;
                }
                break;
        }

        for(var j=0;j<texts.length;j++){
            texts[j].className = '';
        }

        texts[currentIndex].className = "active";
        myAudio.src = "audio/" + dataSrc.data[currentIndex].src;
        myAudio.title = dataSrc.data[currentIndex].title;
        myAudio.play();
        btn.style.background = "url(image/icon.png) 0 -80px no-repeat";

        totalProgress();
    }


    //音量大小控制
    volume.onclick = function (event) {
        var event = event || window.event;
        myAudio.volume = (event.offsetX / volume.clientWidth);

        var volBarWidth = myAudio.volume * volume.clientWidth;
        volBar.style.width = volBarWidth + 'px';
        slideBar.style.left =  volBarWidth + 'px';
    };

    // 播放进度控制
    play.onclick = function (event) {
        var event = event || window.event;
        myAudio.currentTime  = (event.offsetX / play.clientWidth) * myAudio.duration;
        rateChange();
    };


    //播放时间进度更新
    setInterval(function() {
        currentProgress();
        rateChange();

        //列表循环时自动播放下一首
        if (myAudio.currentTime === myAudio.duration && !myAudio.loop) {
            next.onclick();
        }
    }, 1000);

    //当前播放时间转换
    function currentProgress() {
        var m1 = parseInt(myAudio.currentTime/60),
            s1 = parseInt(myAudio.currentTime%60);
        m1 = m1 < 10 ? "0"+m1 : m1;
        s1 = s1 < 10 ? "0"+s1 : s1;
        currentTime.innerHTML = m1+":"+s1;
    }


    //歌曲总播放时间转换
    function totalProgress() {
        myAudio.addEventListener('canplay',function(){
            var time = myAudio.duration;
            var m = parseInt(time/60),
                s = parseInt(time%60);
            m = m < 10 ? "0"+m : m;
            s = s < 10 ? "0"+s : s;
            totalTime.innerHTML = m+":"+s;
        });
    }

    //进度条变动
    function rateChange() {
        var playBarWidth = play.clientWidth;
        var ratio = (myAudio.currentTime / myAudio.duration )* playBarWidth;
        rate.style.width = ratio + "px";
        rateBar.style.left = ratio + "px";
        rate.style.backgroundColor = "#000";
    }


    //设置循环，列表播放切换
    myAudio.loop = false;
    var loopBar = document.getElementById('a-loop');
    lop.onclick = function(){
        if(myAudio.loop) {
            myAudio.loop = false;
            loopBar.style.background = "url(image/icon.png) -80px -45px no-repeat";
            loopBar.setAttribute('title','列表循环');
        }else {
            myAudio.loop = true;
            loopBar.style.background = "url(image/icon.png) -80px 0 no-repeat";
            loopBar.setAttribute('title','单曲循环');
        }
    };


    //设置静音
    myAudio.muted = false;
    silent.addEventListener('click',function(){
        if(myAudio.muted){
            myAudio.muted = false;
            silent.style.background = "url(image/icon.png) 0 0 no-repeat";
        }else {
            myAudio.muted = true;
            silent.style.background = "url(image/icon.png) -40px 0 no-repeat";
        }
    });

};


