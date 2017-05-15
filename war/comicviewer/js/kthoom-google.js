/**
 * Code for handling file access through Google Drive.
 */

if (window.kthoom == undefined) {
  window.kthoom = {};
}

kthoom.google = {

  apiKey: 'AIzaSyApRwQ3x622fi29dZsn4DD98FqYax9dBHY',
  //clientId: '652854531961-pqkhcpcgqda9ag1b9p5gub0vv8f554q0.apps.googleusercontent.com', //google id
  clientId: '629033511865-rmg5d9h3sm7a17oqt2pm56focgvjkba0.apps.googleusercontent.com', //minyoung-lee.appspot id
  authed: false,
  oathToken: undefined,

  boot: function() {
    gapi.client.setApiKey(kthoom.google.apiKey);
    window.setTimeout(function() {
        kthoom.google.authorize(true /* immediate */, function() {});
    }, 1);
  },

  authorize: function(immediate, callbackFn) {
    gapi.auth.authorize({
      'client_id': kthoom.google.clientId,
      'immediate': immediate,
      'response_type': 'token',
      'scope': [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/drive'
      ]
    }, function(result) {
      // If we authenticated, then load the Drive API and after that,
      // call the callback function.
      if (result && !result.error) {
        kthoom.google.oathToken = result.access_token;
        kthoom.google.authed = true;
        gapi.client.load('drive', 'v2', function() {
          gapi.load('picker', callbackFn);
        });
      } else {
        // Else, if we are not Google authenticated, and this was immediate, then
        // just do the callback.  Otherwise, we've failed horribly so die.
        if (immediate) {
          callbackFn();
        } else {
          alert('There was a problem authenticating with Google.  ' +
              'Please try again later.');
        }
      }
    });
  },

  doDrive: function() {
    if (!kthoom.google.authed) {
      kthoom.google.authorize(false /* immediate */, kthoom.google.doDrive);
    } else {
      var docsView = new google.picker.DocsView();
      docsView.setMode(google.picker.DocsViewMode.LIST);
      docsView.setQuery('*.cbr|*.cbz|*.cbt|*.zip');
      var picker = new google.picker.PickerBuilder().
          addView(docsView).
          // Enable this feature when we can efficiently get downloadUrls
          // for each file selected (right now we'd have to do drive.get
          // calls for each file which is annoying the way we have set up
          // library.allBooks).
          enableFeature(google.picker.Feature.MULTISELECT_ENABLED).
          enableFeature(google.picker.Feature.NAV_HIDDEN).
          setOAuthToken(kthoom.google.oathToken).
          setDeveloperKey(kthoom.google.apiKey).
          setAppId(kthoom.google.clientId).
          setCallback(kthoom.google.pickerCallback).
          build();
      console.log("minyoung picker = ",picker);
      picker.setVisible(true);
    }
  },

  pickerCallback : function(data) {
	console.log("minyoung data = ", data);

	//구글 드라이브에서 파일 선택 하면
    if (data.action == google.picker.Action.PICKED) {
        console.log("minyoung selected = ", google.picker.Action.PICKED);
        var gRequest = gapi.client.drive.files.get({'fileId': data.docs[0].id});
        console.log("minyoung gRequest = ", gRequest);
            gRequest.execute(function(response) {
        var xhr = new XMLHttpRequest();
        //실험 코드/////////////////////////////////////////////////////////
        xhr.open('GET', 'http://minyoung-lee.appspot.com/download/1.zip', true);  //실제 파일 주소
        
        //console.log("minyoung downloadUrl = ", downloadUrl);
        xhr.setRequestHeader('Authorization', 'OAuth ' + kthoom.google.oathToken);
        console.log("minyoung oathToken = ", kthoom.google.oathToken);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function (event) {
          var arrayBuffer = event.target.response;
          loadFromArrayBuffer(arrayBuffer);
        };
        xhr.onprogress = function (evt) {
          kthoom.setProgressMeter(evt.loaded / evt.total, 'Loading');
        }
        xhr.send(null);
        //실험 코드/////////////////////////////////////////////////////////
        
      });
    }
  }
 };
