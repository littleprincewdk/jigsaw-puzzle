$(function(){
    'use strict';

    const $Main=$('#main');

    const fragments=[];
    const images=[];
    const nullLocation={};
    let defaults={
        rowNum:3,
        colNum:3,
        fragmentSize:100,
        animation:true,

    };
    defaults.totalFragments=defaults.rowNum*defaults.colNum-1;
    defaults.imageWidth=defaults.colNum*defaults.fragmentSize;
    defaults.imageHeight=defaults.rowNum*defaults.fragmentSize;
    let correctNum=defaults.totalFragments;//位置正确的fragment数量
    nullLocation.row=defaults.rowNum-1;
    nullLocation.col=defaults.colNum-1;

    for(let i=0;i<defaults.rowNum;i++){
        let fragmentRows=[];
        let imageRows=[];
        for(let j=0;(i!==defaults.rowNum-1||j!==defaults.colNum-1)&&j<defaults.colNum;j++){
            let expectedX=defaults.fragmentSize*j;
            let expectedY=defaults.fragmentSize*i;
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


    let mainWidth=defaults.fragmentSize*defaults.colNum;
    let mainHeight=defaults.fragmentSize*defaults.rowNum;
    $Main.width(mainWidth).height(mainHeight);

    init();

    function init(){
        let $Fragment=$('<div class="fragment"><img src="images/jigsaw.jpg" alt="jigsaw"></div>');
        for(let i=0;i<defaults.rowNum;i++){
            for(let j=0;(i!==defaults.rowNum-1||j!==defaults.colNum-1)&&j<defaults.colNum;j++){
                $Fragment.clone().css({
                    width :defaults.fragmentSize,
                    height:defaults.fragmentSize,
                    left  :fragments[i][j].expectedX,
                    top   :fragments[i][j].expectedY,
                })
                .children('img').css({
                    width :defaults.imageWidth,
                    height:defaults.imageHeight,
                    left  :images[i][j].left,
                    top   :images[i][j].top,
                })
                .end()
                    .on('click',function(){
                        let closeToNull=false;
                        for(let m=-1;m<=1;m+=2){
                            let row=fragments[i][j].curRow+m;
                            let col=fragments[i][j].curCol;
                            if(row>=0&&row<defaults.rowNum){
                                if(row===nullLocation.row&&col===nullLocation.col){//和空位置紧邻
                                    closeToNull=true;
                                    let nullPosition=getPositionByIndex(row,col);
                                    if(defaults.animation){
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
                                        if(correctNum===defaults.totalFragments){
                                            setTimeout(function () {
                                                alert('成功!');
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
                            if(col>=0&&col<defaults.colNum){
                                if(row===nullLocation.row&&col===nullLocation.col){//和空位置紧邻
                                    closeToNull=true;
                                    let nullPosition=getPositionByIndex(row,col);
                                    if(defaults.animation){
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
                                        if(correctNum===defaults.totalFragments){
                                            setTimeout(function () {
                                                alert('成功!');
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
    function getPositionByIndex(row,col){
        return {
            x:col*defaults.fragmentSize,
            y:row*defaults.fragmentSize,
        }
    }
});
