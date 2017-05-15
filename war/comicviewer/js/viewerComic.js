//카운터 초기화
var i = 1;

//키보드 입력 처리
document.onkeydown = function(e){ 
    var e = e || window.event;
      if(e.keyCode==37){ // 왼쪽 키 : 이전 장
  	  showPrevPage();
      }
      if(e.keyCode==39){ // 오른쪽 키 : 다음 장
      showNextPage();
      }
      if(e.keyCode==38){ // 위 키 : 다음 책
      counterPlus();
      }
      if(e.keyCode==40){ // 아래 키 : 이전 책
      counterMinus();
      }
}

//다음 화, 다음 장 카운터 처리
function counterPlus(){
	i++;
  	console.log("+i= ", i);
	moveBook(i);
}

function counterMinus(){
    console.log("-i= ", i);
    if(i>1) i--;
	moveBook(i);
}

//미디어로그 원격 파일 로드
//눈에 보이는 입력 주소로는 minyoung-lee.appspot.com/download/1.zip 로 넘어가나
//프록시 서버를 통해 중간에서 medialog.co.kr/download/1.zip 로 변경 됩니다.
function comic1(){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://minyoung-lee.appspot.com/download/1.zip', true);  //테스트 코딩
    xhr.responseType = 'arraybuffer';
    xhr.onload = function (event) {
      var arrayBuffer = event.target.response;
      loadFromArrayBuffer(arrayBuffer);
    };
    xhr.onprogress = function (evt) {
      kthoom.setProgressMeter(evt.loaded / evt.total, 'Loading');
    }
    xhr.send(null);    
}

//책 이동 처리
function moveBook(i){
	closeBook();
	var xhr = new XMLHttpRequest();
    //xhr.open('GET', 'lol'+i+'.zip', true); //로컬 테스트 코드
	xhr.open('GET', 'http://minyoung-lee.appspot.com/download/'+i+'.zip', true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function (event) {
      var arrayBuffer = event.target.response;
      loadFromArrayBuffer(arrayBuffer);
    };
    xhr.onprogress = function (evt) {
      kthoom.setProgressMeter(evt.loaded / evt.total, 'Loading');
    }
    xhr.send(null);    
}


//같은 도메인
function comic2(){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'domain.zip', true);  //테스트 코딩
    xhr.responseType = 'arraybuffer';
    xhr.onload = function (event) {
      var arrayBuffer = event.target.response;
      loadFromArrayBuffer(arrayBuffer);
    };
    xhr.onprogress = function (evt) {
      kthoom.setProgressMeter(evt.loaded / evt.total, 'Loading');
    }
    xhr.send(null);
}

//백업 소스
function comic3(){
	var xhr = new XMLHttpRequest();
    xhr.open('GET', 'webtoon1.zip', true);  
    xhr.responseType = 'arraybuffer';
    xhr.onload = function (event) {
      var arrayBuffer = event.target.response;
      loadFromArrayBuffer(arrayBuffer);
    };
    xhr.onprogress = function (evt) {
      kthoom.setProgressMeter(evt.loaded / evt.total, 'Loading');
    }
    xhr.send(null);
}