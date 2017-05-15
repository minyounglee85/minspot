var span = document.getElementsByTagName('span')[0];
span.textContent = 'WoW Log Media'; // DOM 문자 콘텐츠를 바꿉니다.
span.style.display = 'inline';  // CSSOM 속석을 바꿉니다.
  
// 새로운 엘레먼트를 생성하고 스타일을 입힙니다. 그리고 DOM에 덧붙인다.
var loadTime = document.createElement('div');
loadTime.textContent = '당신은 이 페이지를 다음과 같은 날짜에 로드했습니다 : ' + new Date();
loadTime.style.color = 'blue';
document.body.appendChild(loadTime);