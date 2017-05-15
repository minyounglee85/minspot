//미디어로그 원격 파일 로드
function comic1(){
	var xhr = new XMLHttpRequest();
    xhr.open('GET', 'lol1.zip', true);  
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
	xhr.open('GET', 'http://minyoung-lee.appspot.com/download/1.zip', true);  //실제 파일 주소 
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

//로컬 파일 로드
function comic3(){
	var xhr = new XMLHttpRequest();
    xhr.open('GET', 'lol.zip', true);  
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