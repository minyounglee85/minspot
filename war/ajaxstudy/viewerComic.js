//�̵��α� ���� ���� �ε�
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

//���� ������
function comic2(){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://minyoung-lee.appspot.com/download/1.zip', true);  //���� ���� �ּ� 
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

//���� ���� �ε�
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