$(function(){
    'use strict';

    const $Main=$('#main');
    let mainWidth;
    let mainHeight;
    let fragments=[];
    let images=[];
    let image=new Image();
    image.src='images/jigsaw.jpg';
    $('#model-originalPicture img').prop('src',image.src);
    let $Fragment=$('<div class="fragment"><img src="" alt="jigsaw"></div>');
    let correctNum=0;
    let nullLocation={};
    let settings={
        rowNum:3,
        colNum:3,
        fragmentSize:150,
        animation:true,
    };
    let timer;//定时器
    let $Timer=$('#timer span');
    let time=0;//游戏用时
    initToolBarEvent();
    reset();

    function initToolBarEvent(){
        initReplayEvent();
        selectImage();
    }
    function initDomAndEvents(){

        for(let i=0;i<settings.rowNum;i++){
            for(let j=0;(i!==settings.rowNum-1||j!==settings.colNum-1)&&j<settings.colNum;j++){
                $Fragment.clone().css({
                    width :settings.fragmentSize,
                    height:settings.fragmentSize,
                    left  :fragments[i][j].expectedX,
                    top   :fragments[i][j].expectedY,
                })
                .children('img').prop('src',image.src).css({
                    width :settings.imageWidth,
                    height:settings.imageHeight,
                    left  :images[i][j].left,
                    top   :images[i][j].top,
                })
                .end()
                    .on('click',function(){
                        let closeToNull=false;
                        for(let m=-1;m<=1;m+=2){
                            let row=fragments[i][j].curRow+m;
                            let col=fragments[i][j].curCol;
                            if(row>=0&&row<settings.rowNum){
                                if(row===nullLocation.row&&col===nullLocation.col){//和空位置紧邻
                                    closeToNull=true;
                                    let nullPosition=getPositionByIndex(row,col);
                                    if(settings.animation){
                                        $(this).animate({
                                            left:nullPosition.x,
                                            top :nullPosition.y
                                        });
                                    }else{
                                        $(this).css({
                                            left:nullPosition.x,
                                            top :nullPosition.y
                                        });
                                    }
                                    nullLocation.row=fragments[i][j].curRow;
                                    nullLocation.col=fragments[i][j].curCol;
                                    fragments[i][j].curRow=row;
                                    fragments[i][j].curCol=col;

                                    if(fragments[i][j].correct===false&&fragments[i][j].expectedRow===row&&fragments[i][j].expectedCol===col){
                                        correctNum++;
                                        fragments[i][j].correct=true;
                                        if(correctNum===settings.totalFragments){
                                            setTimeout(function () {
                                                clearInterval(timer);
                                                XPop.pop('confirm','用时'+(time-1)+'s','成功',{
                                                    backdropMode:true,
                                                    margin:100,
                                                }).on('close.XPop',function (e,v) {
                                                    reset();
                                                });
                                            },0)

                                        }
                                    }else if(fragments[i][j].correct===true&&(fragments[i][j].expectedRow!==row||fragments[i][j].expectedCol!==col)){
                                        correctNum--;
                                        fragments[i][j].correct=false;
                                    }

                                    break;//结束循环
                                }
                            }
                        }
                        for(let n=-1;n<=1;n+=2){
                            let row=fragments[i][j].curRow;
                            let col=fragments[i][j].curCol+n;
                            if(col>=0&&col<settings.colNum){
                                if(row===nullLocation.row&&col===nullLocation.col){//和空位置紧邻
                                    closeToNull=true;
                                    let nullPosition=getPositionByIndex(row,col);
                                    if(settings.animation){
                                        $(this).animate({
                                            left:nullPosition.x,
                                            top :nullPosition.y
                                        });
                                    }else{
                                        $(this).css({
                                            left:nullPosition.x,
                                            top :nullPosition.y
                                        });
                                    }
                                    nullLocation.row=fragments[i][j].curRow;
                                    nullLocation.col=fragments[i][j].curCol;
                                    fragments[i][j].curRow=row;
                                    fragments[i][j].curCol=col;
                                    if(fragments[i][j].correct===false&&fragments[i][j].expectedRow===row&&fragments[i][j].expectedCol===col){
                                        correctNum++;
                                        fragments[i][j].correct=true;
                                        if(correctNum===settings.totalFragments){
                                            setTimeout(function () {
                                                clearInterval(timer);
                                                XPop.pop('confirm','用时'+(time-1)+'s','成功',{
                                                    backdropMode:true,
                                                    margin:100,
                                                }).on('close.XPop',function (e,v) {
                                                    reset();
                                                });
                                            },0)
                                        }
                                    }else if(fragments[i][j].correct===true&&(fragments[i][j].expectedRow!==row||fragments[i][j].expectedCol!==col)){
                                        correctNum--;
                                        fragments[i][j].correct=false;
                                    }

                                    break;//结束循环
                                }
                            }
                        }
                        if(!closeToNull){
                            $(this).removeClass('shake');
                            setTimeout(function(){
                                $(this).addClass('animated shake');
                            }.bind(this),0)
                        }
                    })
                    .appendTo($Main);
            }
        }
    }
    function initFragmentAndImagePosition(){
        for(let i=0;i<settings.rowNum;i++){
            let fragmentRows=[];
            let imageRows=[];
            for(let j=0;(i!==settings.rowNum-1||j!==settings.colNum-1)&&j<settings.colNum;j++){
                let expectedX=settings.fragmentSize*j;
                let expectedY=settings.fragmentSize*i;
                let fragment={
                    expectedRow:i,
                    expectedCol:j,
                    expectedX:expectedX,
                    expectedY:expectedY,
                    curRow:i,
                    curCol:j,
                    curX:expectedX,
                    curY:expectedY,
                    correct:true,
                };
                fragmentRows.push(fragment);

                let image={
                    left:-expectedX,
                    top:-expectedY,
                };
                imageRows.push(image);
            }
            fragments.push(fragmentRows);
            images.push(imageRows);
        }
    }
    function selectImage(){
        if(!FileReader){
            alert('您的浏览器不支持读取本地文件!');
            return;
        }
        $('#selectImage').click(function(){
            $('#image').click();
            $(this).blur();
        });
        $('#image').on('change',function(){
            let reader= new FileReader();
            reader.onload=function(e){
                image.src=e.target.result;
                $('#model-originalPicture img').prop('src',e.target.result);
                image.onload=function(){
                    reset();
                };
            };
            if(this.files.length!==0){
                reader.readAsDataURL(this.files[0]);
            }
        });
    }

    function initReplayEvent(){
        $('#replay').on('click',function(){
            settings.rowNum=$('#row').val();
            settings.colNum=$('#col').val();
            reset();

            $(this).blur();
        })
    }
    //设置改变时重置网格
    function reset(){
        settings.fragmentSize=$('#fragmentSize').val();
        settings.rowNum=$('#row').val();
        settings.colNum=$('#col').val();

        settings.totalFragments=settings.rowNum*settings.colNum-1;
        settings.imageWidth=settings.colNum*settings.fragmentSize;
        settings.imageHeight=settings.rowNum*settings.fragmentSize;
        correctNum=settings.totalFragments;//位置正确的fragment数量
        nullLocation.row=settings.rowNum-1;
        nullLocation.col=settings.colNum-1;

        mainWidth=settings.fragmentSize*settings.colNum;
        mainHeight=settings.fragmentSize*settings.rowNum;
        $Main.width(mainWidth).height(mainHeight);

        let loading=XPop.pop('loading','wave');
        destroy();
        initFragmentAndImagePosition();
        initDomAndEvents();
        loading._close();
        //重置定时器
        time=0;
        clearInterval(timer);
        timer=setInterval(function(){
            $Timer.text((time++)+'s');
        },1000)
    }
    function getPositionByIndex(row,col){
        return {
            x:col*settings.fragmentSize,
            y:row*settings.fragmentSize,
        }
    }
    function destroy(){
        $Main.empty();
        fragments=[];
        images=[];
    }
});
