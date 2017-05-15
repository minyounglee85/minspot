/*
*과제 설명: 쿡 앱스 과제
*선정 과제: match 3 게임 프로토타입 제작
*
*개발은 인터넷 및 오픈소스를 활용하며 개발하였습니다. 
*이미지 및 사운드 리소스는 쿡앱스 페이스북 게임에서 가져왔습니다.
*/

window.onload = function() {
    
    //No. 1

    /*********************/
    //프레임워크 셋팅 시작
    /*********************/

	    /****************************/
		//프레임워크 데이터 셋팅 시작
		/****************************/

	    // 캔버스 설정
	    var canvas = document.getElementById("viewport"); 
	    var context = canvas.getContext("2d");
	 
	    // 초당 타이밍 및 프레임
	    var lastFrame = 0;
	    var fpsTime = 0;
	    var frameCount = 0;
	    var fps = 0;

	    /**************************/
		//프레임워크 데이터 셋팅 끝
		/**************************/



	    /*********************/
	    //게임 데이터 셋팅 시작
	    /*********************/

	    //음악 재생 여부. playBgm();
	    var isPlayBgm = true;

	    //스테이지 백그라운드 음악 
	    var backgrondBgm;
		var backgroundBgmObj = new Array();
	    var stageBgm = './sound/stagebgm.mp3';
	    var levelBgm = './sound/levelbgm.mp3';

		//효과음: playSound();
		var clickSound = './sound/click.mp3'; 
		var swapSound = './sound/swap.mp3'; 
		var brokenSound = './sound/broken.mp3'; 
		var swapfailSound = './sound/swapfail.mp3'; 

	    // 클러스터 상태
        var clusters = [];  // { column, row, length, horizontal }
        
        // 이동 상태
    	var moves = [];     // { column1, row1, column2, row2 }

    	// 현재 이동 상태
    	var currentMove = { column1: 0, row1: 0, column2: 0, row2: 0 };
	    
	    var level = {
	        x: 250,         // X 좌표
	        y: 113,         // Y 좌표
	        columns: 8,     // columns 타일 수
	        rows: 8,        // rows 타일 수
	        tileWidth: 60,  // 타일 너비
	        tileHeight: 60, // 타일 높이
	        tiles: [],      // 2차원 타일 어레이
	        selectedtile: { selected: false, column: 0, row: 0 }
	    };


    	// 배경 사진
    	var backgrondImg;
		var backgroundImgObj = new Array();
		makeBackgroundSrc('./image/blankstage.png');
		makeBackgroundSrc('./image/webstage.png');
		makeBackgroundSrc('./image/back.png');

		var sourceX = 0; 
    	var sourceY = 0; 
    	var sourceWidth = canvas.width; 
    	var sourceHeight = canvas.height; 
    	var destWidth = sourceWidth; 
    	var destHeight = sourceHeight; 
    	var destX = canvas.width / 2 - destWidth / 2; 
    	var destY = canvas.height / 2 - destHeight / 2; 

    	// 타일 이미지 8개: tileObj[0~7]
		var img;
		var tileObj = new Array();
		makeTileSrc('./image/tile_bbal.png');
		makeTileSrc('./image/tile_joo.png');
		makeTileSrc('./image/tile_no.png');
		makeTileSrc('./image/tile_cho.png');
		makeTileSrc('./image/tile_pa.png');
		makeTileSrc('./image/tile_nam.png');
		makeTileSrc('./image/tile_bo.png');
		makeTileSrc('./image/tile_blank.png');

		// 게임 상태
    	var gameStates = { init: 0, ready: 1, resolve: 2, start: 3};
    	var gameState = gameStates.init;

    	// 점수
    	var score = 0;

    	// 이동횟숫 카운트
    	var countMove = 0;

    	// 마우스 드래그
    	var drag = false;

    	// 게임 내 버튼
    	var buttons = [ { x: 647, y: 10, width: 63, height: 30, text: ""}, //음악 재생
    					{ x: 700, y: 10, width: 63, height: 30, text: ""}  //새 게임
    				  ];

    	// 게임 오버
    	var gameover = false;

    	// 애니메이션 셋팅
    	var animationState = 0;
    	var animationTime = 0;
    	var animationTimetotal = 0.3;

	    /*********************/
	    //게임 데이터 셋팅 끝
	    /*********************/

	// 게임 함수: 이미지 경로 생성 및 배열에 삽입
	function makeTileSrc(imageFilePath){
		img = new Image();
		img.src = imageFilePath;
		tileObj.push(img);
	}

	// 게임 함수: 백그라운드 이미지 경로 생성 및 배열 삽입
	function makeBackgroundSrc(imageFilePath){
		backgrondImg = new Image();
		backgrondImg.src = imageFilePath;
		backgroundImgObj.push(backgrondImg);
	}

	// 게임 함수: 사운드 경로 생성 및 재생
	function playSound(soundFilePath) {
		var soundPath = new Audio(soundFilePath);
		soundPath.play();
	}

	// 게임 함수: 백그라운드 음악 경로 생성 및 재생
	function playBgm(bgmFilePath) {
		bgmPath = new Audio(bgmFilePath); 
		bgmPath.addEventListener('ended', function() {
		    this.currentTime = 0;
		    this.play();
		}, false);
		bgmPath.play();
	}

	//No.2 초기화(오브젝트 및 속성)
    function init() {

        // 마우스 이벤트 추가
        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("mousedown", onMouseDown);
        canvas.addEventListener("mouseup", onMouseUp);
        canvas.addEventListener("mouseout", onMouseOut);

        // 2차원 타일 어레이 초기화 00, 01 ~ 76, 77
        for (let i=0; i<level.columns; i++) {
            level.tiles[i] = [];
            //console.log(level.tiles[i]);
            for (let j=0; j<level.rows; j++) {
                
                // 타일 유형 및 이동 매개 변수 정의 및 초기화
                level.tiles[i][j] = { type: 0, shift:0 }
                //console.log(level.tiles[i][j].type);
            }
        }
        
        playBgm(levelBgm);

        // 새로운 게임
 		newGame();

        // 메인 루프
        main(0); 

    }

    // 게임 함수: 게임 실행
    function newGame() {

    	// 점수 초기화
        score = 0;
        countMove = 0;
        
        // 게임 상태값 설정
        gameState = gameStates.ready;
        
        // 게임오버 상태값 초기화
        gameover = false;

        createLevel();
        findMoves();
        findClusters(); 

    }

    /* 게임 함수: 랜덤 레벨 생성(2차원 그리드에 타일 삽입)
    *
	* <게임 시작 규칙>
	* 1. 레벨 생성은 랜덤하게 이루어 진다.
    * 2. 3개 이상의 도일한 타일이 연속으로 나열되어 있으면 안된다.
	* 3. 최소 유효한 3매칭 타일이 1개 이상 존재하여야 한다.
	*/
    function createLevel() {
        var done = false;
 
        // 레벨 생성 true 될때까지.
        while (!done) {
 
            // 8*8 크기의 타일 배열에 임의의 타일로 채운다.
            for (let i=0; i<level.columns; i++) {
                for (let j=0; j<level.rows; j++) {

                	//getRandomTile() -> 0~7
                    level.tiles[i][j].type = getRandomTile(); 
                }
            }
 
            // 클러스터 있는지 확인한다. 있으면 없을때 까지 제거 후 새 랜덤 타일로 삽입.
            resolveClusters();
 
            // 유효한 이동 수단이 있는지 판단
            findMoves();
 
            // 유효한 이동 수단이 있으면 while문 종료, 없다면 레벨 다시 생성
            if (moves.length > 0) {
                done = true;
            }
        }
    }

    // 게임 함수: 타일 랜덤으로 가져오기 0~7
    function getRandomTile() {
        return Math.floor(Math.random() * 7);
    }

    // 게임 함수: 클러스터 없을때 까지 타일 지우기 및 새 랜덤 타일로 삽입. 
    function resolveClusters() {
        
        // 클러스터 체크
        findClusters();
 
        // 클러스터가 없을 때까지 클러스터를 계속 제거.
        while (clusters.length > 0) {
 
            // 클러스터 제거
            removeClusters();
 
            // 타일을 제거하는 동안 새 랜덤 타일을 삽입한다.
            shiftTiles();
 
            //  클러스터 찾기
            findClusters();
        }
    }

    /*
	*게임 함수: 클러스터 찾기
    *클러스터란? 동일한 유형의 3개 또는 그 이상의 인접한 타일을 뜻한다.
    *각 행에서 첫번째 열(row)에 타일로 시작하여 matchLength 카운터를 하나씩 초기화한다.
    *이 첫번째 타일에서 다음 타일로 이동하며 서로의 타일이 같은 유형인지 확인한다.
    *만약 동일하다면, 마지막 타일에 도달할 때까지 matchLength 카운터를 증가시키고 다음 타일로 옮겨 간다. 
    *matchLength가 3보다 크거나 같은지 확인한다.
    *즉, 클러스터를 찾았다면 클러스터 배열에 추가한다.
    *만약 우리가 마지막 타일에 위치해 있다면, 다음 행으로 이동하고 그 과정을 반복한다. 
    */
    
    function findClusters() {
        // 클러스터 초기화.
        clusters = []
 
        // 수평 클러스터 찾기.
         for (let j=0; j<level.rows; j++) {
            
            // 클러스터 기본 값은 1로 셋팅.
            var matchLength = 1;
            for (let i=0; i<level.columns; i++) {
                var checkCluster = false;
                //console.log(i,j);
                if (i == level.columns-1) { 
                    
                    // 마지막 타일이면 다음 줄 -> (0,1,2,3,4,5,6,"7" == 8-1, 8-1, 8-1, 8-1, 8-1, 8-1, 8-1, "8-1")
                    checkCluster = true;
                } else {
                    
                    // 현재 타일과 다음 타일의 유형이 같은지 확인
                    // 유형은 0~6 까지 있다.
                    if (level.tiles[i][j].type == level.tiles[i+1][j].type &&
                        level.tiles[i][j].type != -1) {

                    	/*
                    	*타일 배열
                    	*[0,0][1,0][2,0][3,0][4,0][5,0][6,0][7,0]
                        *[0,1][1,1][2,1][3,1][4,1][5,1][6,1][7,1]
                        *[0,2][1,2][2,2][3,2][4,2][5,2][6,2][7,2]
                        *[0,3][1,3][2,3][3,3][4,3][5,3][6,3][7,3]
                        *[0,4][1,4][2,4][3,4][4,4][5,4][6,4][7,4]
                        *[0,5][1,5][2,5][3,5][4,5][5,5][6,5][7,5]
                        *[0,6][1,6][2,6][3,6][4,6][5,6][6,6][7,6]
                        *[0,7][1,7][2,7][3,7][4,7][5,7][6,7][7,7]
						*
                    	*level.tiles[0][0].type == level.tiles[0+1][0].type &&
                        *level.tiles[0][0].type != -1
                        *[0,0][1,0] 비교.
						*
                        *level.tiles[1][0].type == level.tiles[1+1][0].type &&
                        *level.tiles[1][0].type != -1
                        *[1,0][2,0] 비교 ~ 이하 동일.
						*
                        */

                        // 이전 타일과 동일하면, matchLength + 1
                        matchLength += 1;
                    } else {
                        
                        // 다른 유형
                        checkCluster = true;
                    }
                }
 
                // 클러스터가 있는지 확인.
                if (checkCluster) {
                    if (matchLength >= 3) {
                        
                        /*
                        * 수평 클러스터를 찾은경우.
                        * i=4, j=3 에서 matchLength 3인 경우 -> 4+1-3, 3, 3, true = 2, 3, 3, true
                        * i=5, j=7 에서 matchLength 5인 경우 -> 5+1-5, 7, 5, true = 1, 7, 5, true
                        */
                        
                        clusters.push({ column: i+1-matchLength, 
                        				row:j,
                                        length: matchLength, 
                                        horizontal: true 
                        });
                    }
 
                    matchLength = 1;
                }
            }//columns for문 끝
            
        }//rows for문 끝

        // 수직 클러스터 찾기. 수평과 같은 방법.
        for (let i=0; i<level.columns; i++) {
            var matchLength = 1;
            for (let j=0; j<level.rows; j++) {
                var checkCluster = false;
                
                if (j == level.rows-1) {
                    checkCluster = true;
                } else {

                	/*
                	[00][01][02][03][04][05][06][07]
                	[10][11][12][13][14][15][16][17]
                	[20][21][22][23][24][25][26][27]
                	[30][31][32][33][34][35][36][37]
                	[40][41][42][43][44][45][46][47]
                	[50][51][52][53][54][55][56][57]
                	[60][61][62][63][64][65][66][67]
                	[70][71][72][73][74][75][76][77]
                	*/
                    if (level.tiles[i][j].type == level.tiles[i][j+1].type &&
                        level.tiles[i][j].type != -1) {
                        matchLength += 1;
                    } else {
                        checkCluster = true;
                    }
                }
 
                if (checkCluster) {
                    if (matchLength >= 3) {
                        clusters.push({ column: i, 
                        				row:j+1-matchLength,
                                        length: matchLength, 
                                        horizontal: false 
                        });
                    }
 
                    matchLength = 1;
                }
            }
            
        }
    }

    // 게임 함수: 2개의 타일을 교환
    // 두개의 타일을 수평 또는 수직으로 교환할 수 있다.
    // 만약 3개 이상의 동일 유형의 타일이 인접해 있다면, 유효 이동 수단으로 처리한다.
    // 모든 수평, 수직 스왑을 시도하는 함수를 만들고, findCluster()를 통해 스왑하는 클러스터가 유효한지 찾는다.
    function swap(x1, y1, x2, y2) {

    	//타일 유형 바꾸기 x1y1 <-> x2y2
        var typeswap = level.tiles[x1][y1].type; 
        level.tiles[x1][y1].type = level.tiles[x2][y2].type;
        level.tiles[x2][y2].type = typeswap; 
    }

    // 게임 함수: 이동 가능한 수단을 찾는다.
    function findMoves() {
        
        // moves 초기화
        moves = []
 
        // 수평 스왑 체크
        for (let j=0; j<level.rows; j++) {
            for (let i=0; i<level.columns-1; i++) {
                
                /*
                *스왑 후 클러스터를 찾아보고, 이 후 다시 스왑 이전 상태로 되돌린다.
                *
                *타일 배열
                *[0,0][1,0][2,0][3,0][4,0][5,0][6,0][7,0]
                *[0,1][1,1][2,1][3,1][4,1][5,1][6,1][7,1]
                *[0,2][1,2][2,2][3,2][4,2][5,2][6,2][7,2]
                *[0,3][1,3][2,3][3,3][4,3][5,3][6,3][7,3]
                *[0,4][1,4][2,4][3,4][4,4][5,4][6,4][7,4]
                *[0,5][1,5][2,5][3,5][4,5][5,5][6,5][7,5]
                *[0,6][1,6][2,6][3,6][4,6][5,6][6,6][7,6]
                *[0,7][1,7][2,7][3,7][4,7][5,7][6,7][7,7]
                *
				swap();
                0, 0, 0+1, 0 = [0, 0][1, 0]
                1, 0, 1+1, 0 = [1, 0][2, 0]
                2, 0, 2+1, 0 = [2, 0][3, 0]
                *
                */
                //console.log("["+i,j+"]", "["+(i+1),j+"]");

                swap(i, j, i+1, j);
                findClusters();
                swap(i, j, i+1, j); 
 
                // 스왑 후 클러스터 상태가 맞는지 판단.
                if (clusters.length > 0) {
                    
                    // 유효한 이동 수단을 찾았다! 0 0 1 0
                    moves.push({column1: i, 
                    		    row1: j, 
                    		    column2: i+1, 
                    		    row2: j
                    });
                }
            }
        }
 
        // 수직 스왑 체크
        for (let i=0; i<level.columns; i++) {
            for (let j=0; j<level.rows-1; j++) {
                swap(i, j, i, j+1);
                findClusters();
                swap(i, j, i, j+1);
 
                if (clusters.length > 0) {
                    moves.push({column1: i, row1: j, column2: i, row2: j+1});
                }
            }
        }
 
        // 클러스터 상태 초기화
        clusters = []
    }

	/*
    * 게임 함수: 클러스터 제거
    * 클러스터가 제거되면 해당 그리드에 빈 타일(구멍)으로 처리.
    * 새로운 타일이 빈 타일(구멍) 위에 나타나야 한다.
    * 이 함수는 빈 타일(구멍)을 생성하고 유형을 -1로 설정한다.
    * 이 빈 타일(구멍)이 생성된 후에 남은 타일을 아래쪽으로 이동 시키고, 이동 매개 변수에 이 번호를 저장하는 방법을 계산한다.
    */

    function removeClusters() {
        
        // 제거된 타일 유형을 -1 로 가르킨다.
        loopClusters(function(index, column, row, cluster) { level.tiles[column][row].type = -1; });
 		
        // 타일 아래로 이동하는 방법을 계산한다.
        for (let i=0; i<level.columns; i++) {
            var shift = 0;
            for (let j=level.rows-1; j>=0; j--) {
                
                if (level.tiles[i][j].type == -1) {
                    
                    // 타일이 제거 되고(-1), 이동이 증가.
                    console.log("Remove tile");

                    // 타일 깨지는 소리
                    playSound(brokenSound);

                    // 시프트 상태세우기
                    shift++;
                    level.tiles[i][j].shift = 0;
                } else {
                    
                    // 이동 설정
                    level.tiles[i][j].shift = shift;
                }
            }
        }
    }


    // 게임 함수: 클러스터 제거 후 -> 타일 이동을 통해 새 타일을 삽입한다.
    function shiftTiles() {

        // 타일 이동
        for (let i=0; i<level.columns; i++) {
            for (let j=level.rows-1; j>=0; j--) {
                
                // 빈 타일 찾기
                if (level.tiles[i][j].type == -1) {

                    // 새로운 타일 삽입 0~6
                    level.tiles[i][j].type = getRandomTile();
                    console.log("Insert tile: "+level.tiles[i][j].type);
                } else {

                    // 타일스왑
                    var shift = level.tiles[i][j].shift;
                    if (shift > 0) {

                    	// 반 타일 있으면 아래로 이동 시킨다.
                    	console.log("Shift tile");
                        swap(i, j, i, j+shift)
                    }
                }
 
                // 이동 초기화
                level.tiles[i][j].shift = 0;
            }
        }
    }

    // 게임 함수: 클러스터 반복
    function loopClusters(func) {
        for (let i=0; i<clusters.length; i++) {

            // { column, row, length, horizontal }
            var cluster = clusters[i];
            var coffset = 0;
            var roffset = 0;
            for (let j=0; j<cluster.length; j++) {
                func(i, cluster.column+coffset, cluster.row+roffset, cluster);
                
                if (cluster.horizontal) {
                    coffset++;
                } else {
                    roffset++;
                }
            }
        }
    }

    // 게임 함수: 마우스 위치 타일 얻기.
    function getMouseTile(pos) {

        // 타일 인덱스 계산.
        var tx = Math.floor((pos.x - level.x) / level.tileWidth);
        var ty = Math.floor((pos.y - level.y) / level.tileHeight);
        
        // 타일이 유효한지 확인.
        if (tx >= 0 && tx < level.columns && ty >= 0 && ty < level.rows) {
            
            // 타일이 유효.
            return {
                valid: true,
                x: tx,
                y: ty
            };
        }
        
        // 타일이 유효하지 않다.
        return {
            valid: false,
            x: 0,
            y: 0
        };
    }

    // 게임 함수: 2개의 타일을 스왑할 수 있는지 확인
    function canSwap(x1, y1, x2, y2) {
        
        // 선택한 타일이 이웃 타일과 직접적으로 인접해 있는지 확인
        if ((Math.abs(x1 - x2) == 1 && y1 == y2) ||
            (Math.abs(y1 - y2) == 1 && x1 == x2)) {

        	//스왑 사운드 재생
        	playSound(swapSound);
            return true;
        }
        
        return false;
    }

    // 게임 함수: 2개의 타일을 스왑한다.
    function mouseSwap(c1, r1, c2, r2) {
       
        // 현재 움직임 상태 저장
        currentMove = {column1: c1, row1: r1, column2: c2, row2: r2};
    
        // 선택 취소
        level.selectedtile.selected = false;

        // 시작 애니메이션
        animationState = 2;
        animationTime = 0;
        gameState = gameStates.resolve;

    }
 
    // No.3 메인 반복문
    function main(tframe) {
        
        // 시간 기반으로 애니메이션 프레임 요청(렌더링 반복문)
        window.requestAnimationFrame(main);
 
        // 업데이트 및 렌더 게임
        update(tframe);
        render();
    }
 
    // No.4 상태 업데이트(오브젝트 업데이트)
    function update(tframe) {
        var dt = (tframe - lastFrame) / 1000;
        lastFrame = tframe;
 
        // FPS 카운터 업데이트
        updateFps(dt);

        //to do
         if (gameState == gameStates.ready) {
            // 게이머 입력 대기 완료.
            
            // 게임 오버 조건 체크
            if (moves.length <= 0) {
                gameover = true;
                console.log("Game Over");
            }
            
        } else if (gameState == gameStates.resolve) {
            // 클러스터 분석
            animationTime += dt;
            
            if (animationState == 0) {
                
                // 클러스터를 찾아 제거해야 한다.
                if (animationTime > animationTimetotal) {
                    
                    // 클러스터 찾기
                    findClusters();
                    
                    if (clusters.length > 0) {
                        
                        // 점수 올리기
                        for (var i=0; i<clusters.length; i++) {
                            
                            // 클러스터 상태에 따라서 점수 추가
                            score += 100 * (clusters[i].length - 2);

                            //움직임 횟수 증가.
                            countMove++;

                        }
                    
                        // 클러스터 찾고 제거.
                        removeClusters();
                        
                        // 타일 이동 필요
                        animationState = 1;
                    } else {

                        // 클러스터 없으면 애니메이션 종료
                        gameState = gameStates.ready;
                    }
                    animationTime = 0;
                }
            } else if (animationState == 1) {
                
                // 타일 이동 필요
                if (animationTime > animationTimetotal) {
                    
                    // 타일 이동
                    shiftTiles();
                    
                    // 새 클러스터 찾기
                    animationState = 0;
                    animationTime = 0;
                    
                    // 새로운 클러스터가 있는지 확인
                    findClusters();
                    if (clusters.length <= 0) {

                        // 애니메이션 종료
                        gameState = gameStates.ready;
                    }
                }
            } else if (animationState == 2) {
                
                // 스왑 타일 애니메이션
                if (animationTime > animationTimetotal) {
                    
                    // 타일 스왑
                    swap(currentMove.column1, currentMove.row1, currentMove.column2, currentMove.row2);
                    
                    // 스왑을 통해 클러스터가 만들어지는지 확인
                    findClusters();
                    if (clusters.length > 0) {
                        
                        // 스왑으로 통해 하나 이상의 클러스터 찾음
                        // 애니메이션 준비
                        animationState = 0;
                        animationTime = 0;
                        gameState = gameStates.resolve;
                    } else {

                        // 스왑을 해도 클러스터 없으면, 되돌리기 한다.
                        playSound(swapfailSound);
                        animationState = 3;
                        animationTime = 0;
                    }
                    
                    // 이동 및 클러스터 업데이트
                    findMoves();
                    findClusters();
                }
            } else if (animationState == 3) {
                // 스왑 되돌리는 애니메이션
                if (animationTime > animationTimetotal) {
                    
                    // 스왑 돌리기
                    swap(currentMove.column1, currentMove.row1, currentMove.column2, currentMove.row2);
                    
                    // 애니메이션 종료.
                    gameState = gameStates.ready;
                }
            }
            
            // 업데이트 이동 및 클러스터
            findMoves();
            findClusters();
        }

    }
 
    // No.5 Fps 업데이트
    function updateFps(dt) {
        if (fpsTime > 0.25) {
           
            // FPS 계산
            fps = Math.round(frameCount / fpsTime);
 
            // 타임 및 프레임 카운트 리셋
            fpsTime = 0;
            frameCount = 0;
        }
 
        // 시간 및 프레임 카운트 증가
        fpsTime += dt;
        frameCount++;
    }

    // 게임 함수: 텍스트 출력(중앙 정렬)
    function drawCenterText(text, x, y, width) {
        var textdim = context.measureText(text);
        context.fillText(text, x + (width-textdim.width)/2, y);
    }

    // 게임 함수: 버튼 그리기
    function drawButtons() {
        for (let i=0; i<buttons.length; i++) {
            // 버튼 쉐잎 그리기
            context.fillStyle = 'rgba(0, 0, 0, 0)';
            context.fillRect(buttons[i].x, buttons[i].y, buttons[i].width, buttons[i].height);
            
            // 버튼 텍스트 그리기
            context.fillStyle = "#ffffff";
            context.font = "18px Verdana";
            var textdim = context.measureText(buttons[i].text);
            context.fillText(buttons[i].text, buttons[i].x + (buttons[i].width-textdim.width)/2, buttons[i].y+30);
        }
    }

    // 게임 함수: 타일 렌더.
    function renderTiles() {
        for (let i=0; i<level.columns; i++) {
            for (let j=0; j<level.rows; j++) {
                
                // 애니메이션을 위해 움직임 정보 가져오기
                var shift = level.tiles[i][j].shift;
                
                // 타일 좌표 계산
                var coord = getTileCoordinate(i, j, 0, (animationTime / animationTimetotal) * shift);
                
                // 타일이 존재하는지 판단.
                if (level.tiles[i][j].type >= 0) {
                    
                    // 타일 종류 판단
                    var renderType = level.tiles[i][j].type;
                    
                    // 타일 그리기
                    drawTile(coord.tilex, coord.tiley, renderType);
                }
                
                // 선택 된 타일 그리기
                if (level.selectedtile.selected) {
                    if (level.selectedtile.column == i && level.selectedtile.row == j) {
                       
                        // 선택 된 타일을 지정된 형태로 그리기.
                        drawTile(coord.tilex, coord.tiley, renderType, 1); //0=9, 1=10, ...

                    }
                }
            }
        }
        
        // 스왑 애니메이션
        if (gameState == gameStates.resolve && (animationState == 2 || animationState == 3)) {
            
            // 좌표 계산
            var shiftx = currentMove.column2 - currentMove.column1;
            var shifty = currentMove.row2 - currentMove.row1;

            // 첫번째 타일
            var coord1 = getTileCoordinate(currentMove.column1, currentMove.row1, 0, 0);
            var coord1shift = getTileCoordinate(currentMove.column1, currentMove.row1, (animationTime / animationTimetotal) * shiftx, (animationTime / animationTimetotal) * shifty);
            var type1 = level.tiles[currentMove.column1][currentMove.row1].type;

            // 두번째 타일
            var coord2 = getTileCoordinate(currentMove.column2, currentMove.row2, 0, 0);
            var coord2shift = getTileCoordinate(currentMove.column2, currentMove.row2, (animationTime / animationTimetotal) * -shiftx, (animationTime / animationTimetotal) * -shifty);
            var type2 = level.tiles[currentMove.column2][currentMove.row2].type;

            // 백그라운드 타일(그리드) 그리기
            drawTile(coord1.tilex, coord1.tiley, 7);
            drawTile(coord2.tilex, coord2.tiley, 7);
            
            // 애니메이션 상태에 다라 명령을 바꾼다.
            if (animationState == 2) {
                
                // 타일 그리기
                drawTile(coord1shift.tilex, coord1shift.tiley, type1);
                drawTile(coord2shift.tilex, coord2shift.tiley, type2);
            } else {
                
                // 타일 그리기
                drawTile(coord2shift.tilex, coord2shift.tiley, type2);
                drawTile(coord1shift.tilex, coord1shift.tiley, type1);
            }
        }
    }

    // 게임 함수: 타일 좌표 가져오기
    function getTileCoordinate(column, row, columnoffset, rowoffset) {
       
        var tilex = level.x + (column + columnoffset) * level.tileWidth;
        var tiley = level.y + (row + rowoffset) * level.tileHeight;
        return { tilex: tilex, tiley: tiley};
    }

    // 게임 함수: 타일 그리기
    function drawTile(x, y, renderType, tileState) {
        
        // 타일 종류에 맞게 이미지 매칭
        context.drawImage(tileObj[renderType], x, y, 55-1, 55-1);
        
        // 타일 선택하면 이미지를 크게 한다.
        if(tileState==1){
        	context.drawImage(tileObj[renderType], x-4, y-4, 62, 62);
        }

    }
    
    // No.6 렌더(화면그리기)
    function render() {
       
        // 프레임 그리기
        drawFrame();

        // to do

        // 점수판 그리기
        context.fillStyle = "white";
        context.font = "20px Verdana";
        drawCenterText(score, 30, 60, 155);

        // 이동 횟수 그리기
		context.fillStyle = "white";
        context.font = "20px Verdana";
        drawCenterText(countMove, 30, 270, 155);

        // 버튼 그리기
        drawButtons();

        // 레벨(그리드) 백그라운드 그리기.
        var levelWidth = level.columns * level.tileWidth;
        var levelHeight = level.rows * level.tileHeight;
        context.fillStyle = "gray";
        context.fillRect(level.x - 3, level.y - 3, levelWidth + 2, levelHeight + 2);

        //타일 그리기
        renderTiles();

    }
 
    // No.7 프레임 및 테두리 그리기
    function drawFrame() {
       
        // 게임 백그라운드
    	context.drawImage(backgroundImgObj[0], sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

        // 헤더 출력
        //context.fillStyle = "black";
        //context.fillRect(0, 0, canvas.width, 20);

        // 풋터 출력
        //context.fillStyle = "black";
		//context.fillRect(1, 610, canvas.width, 20);        
 
        // 타이틀 출력
        context.fillStyle = "#ffffff";
        context.font = "5px 맑은고딕";
        context.fillText("match-3 Prototype for cookapps", 8, 10);
 
    }
 	
 	/****************************/
    // 마우스 이벤트 핸들러 시작
    /****************************/
    
    // 마우스 롤오버
    function onMouseMove(e) {
    	
    	// 마우스 커서 위치 가져오기
        var pos = getMousePos(canvas, e);
        
        // 선택한 타일을 끌어 놓았는지 확인
        if (drag && level.selectedtile.selected) {
            
            // 마우스 커서에 위치한 타일 가져오기
            mt = getMouseTile(pos);

            if (mt.valid) {
                // 유효 타일
                
                // 스왑 가능한 타일인지 확인
                if (canSwap(mt.x, mt.y, level.selectedtile.column, level.selectedtile.row)){
                    
                    // 타일 스왑
                    mouseSwap(mt.x, mt.y, level.selectedtile.column, level.selectedtile.row);
                }
            }
        }
    }
    
    // 마우스 클릭
    function onMouseDown(e) {
    	
    	// 마우스 포지션 가져오기
        var pos = getMousePos(canvas, e);

        // 선택한 타일 좌표 가져오기
        console.log("X Y: "+Math.floor((pos.x - level.x) / level.tileWidth), Math.floor((pos.y - level.y) / level.tileHeight));

        // 드래그 시작
        if (!drag) {

            // 마우스 포인터에 있는 타일 가져오기
            mt = getMouseTile(pos);
            
            if (mt.valid) {
                
                // 타일 선택 소리
                playSound(clickSound);

                // 유효 타일
                var swapped = false;
                if (level.selectedtile.selected) {

                    if (mt.x == level.selectedtile.column && mt.y == level.selectedtile.row) {
                        
                        // 같은 타일이 선택 되었다면 선택 취소한다.
                        level.selectedtile.selected = false;
                        drag = true;
                        return;
                    } else if (canSwap(mt.x, mt.y, level.selectedtile.column, level.selectedtile.row)){
                        
                        // 타일 교환이 가능하면 교환한다.
                        mouseSwap(mt.x, mt.y, level.selectedtile.column, level.selectedtile.row);
                        swapped = true;
                    }
                }
                
                if (!swapped) {

                    // 새로 선택된 타일 설정
                    level.selectedtile.column = mt.x;
                    level.selectedtile.row = mt.y;
                    level.selectedtile.selected = true;
                }
            } else {
                
                // 유효하지 않은 타일
                level.selectedtile.selected = false;
            }

            // 드래그 시작

            drag = true;
        }
        
        // 버튼이 클릭 된 경우
        for (let i=0; i<buttons.length; i++) {

            if (pos.x >= buttons[i].x && pos.x < buttons[i].x+buttons[i].width &&
                pos.y >= buttons[i].y && pos.y < buttons[i].y+buttons[i].height) {
                
                // 음악 on/off 버튼
                if (i == 0) {
                    
               		switch(isPlayBgm){ 
					    
					    case true:
					    console.log("Music off");
					    //levelMusic.pause();
					    bgmPath.pause();
					    isPlayBgm = false;
					    break;
					    
					    case false: 
					    console.log("Music on");
					    //levelMusic.play();
					    bgmPath.play();
					    isPlayBgm = true;
					    break; 
					} 
                }

                // 새 게임 버튼
                if (i == 1) {
                    console.log("New Game");
                	newGame();

                }  
            }
        }
    }
    
    function onMouseUp(e) { drag = false; }
    function onMouseOut(e) { drag = false; }

    /****************************/
    // 마우스 이벤트 핸들러 끝
    /****************************/
 
    // 게임 함수: 마우스 좌표 가져오기
    function getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
            y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
        };
    }
 
    // 게임 시작을 위한 초기화
    init();

    /********************/
    //프레임워크 셋팅 끝
    /********************/

};