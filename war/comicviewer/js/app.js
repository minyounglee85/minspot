var span = document.getElementsByTagName('span')[0];
span.textContent = 'WoW Log Media'; // DOM ���� �������� �ٲߴϴ�.
span.style.display = 'inline';  // CSSOM �Ӽ��� �ٲߴϴ�.
  
// ���ο� ������Ʈ�� �����ϰ� ��Ÿ���� �����ϴ�. �׸��� DOM�� �����δ�.
var loadTime = document.createElement('div');
loadTime.textContent = '����� �� �������� ������ ���� ��¥�� �ε��߽��ϴ� : ' + new Date();
loadTime.style.color = 'blue';
document.body.appendChild(loadTime);