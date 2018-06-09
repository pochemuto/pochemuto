(function(window){
	'use strict';

	var VPushes = function () {

		var url = document.getElementById('scriptPusherLegal').getAttribute('src');
		var paramsStr = url.split('?')[1];
		var paramsArr = paramsStr.split('&');
		var paramsObj = {};

		paramsArr.forEach( function(param)  {
			var paramArr = param.split('=');
		  	paramsObj[paramArr[0]] = paramArr[1];
		});

		this.options = {
			webmaster_id: "33",
			sub1: paramsObj.sub1,
			sub2: paramsObj.sub2,
			sub3: paramsObj.sub3,
			sub4: paramsObj.sub4,
			pusherUrl: 'https://pochemuto.com/js/vpusher.js',
			iframeUrl: 'https://pochemuto.com/js/iframe.html',
			translate: {
				subscribeText: 'Subscribe notifications??',
				subscribeApprove: 'Subscribe',
				subscribeCancel: 'Cancel',
				iframeTitle: 'Subscribe now'
			},
			showDelay: 2000 //ms
		};


		//Check protocol
		if(location.protocol === 'https:') {
			this.httpsCase();
		} else {
			this.httpCase();
		}



	};

	VPushes.prototype = {
		//non https site
		httpCase: function () {
			var modal = document.createElement('div'),
				cancel = document.createElement('button'),
				approve = document.createElement('button'),
				options = this.options,
				btnStyle = 'border: none; border-radius: 3px; text-transform: uppercase; font-size: 14px; font-weight: 500; cursor: pointer; box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,0.12); padding: 0 8px; display: inline-block; line-height: 36px; margin: 0 10px;';

			cancel.innerHTML = options.translate.subscribeCancel;
			approve.innerHTML = options.translate.subscribeApprove;
			modal.innerHTML = '<p>'+options.translate.subscribeText+'</p>';

			modal.setAttribute('style', 'transition: all 0.3s ease; text-align: center; font-family: "Arial", sans-serif; box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12); position: fixed; border-radius: 2px; background-color: #fff; border-radius: 3px; padding:16px; position: fixed; top: 20px; left:-500px;');
			approve.setAttribute('style', btnStyle + 'background-color: #2196F3; color:#fff;');
			cancel.setAttribute('style', btnStyle + 'background-color:#fff;');

			modal.appendChild(cancel);
			modal.appendChild(approve);

			cancel.addEventListener('click', function(event){
				event.stopPropagation();
				document.body.removeChild(modal);
			});

			approve.addEventListener('click', function(event){
				event.stopPropagation();
				var subs = document.getElementById('scriptPusherLegal').getAttribute('src').match(/sub.*/gm);
				var search = location.search,
					additionalParams = 'webmaster_id='+options.webmaster_id+'&host='+location.host+'&subs='+subs;

				if(search == '') {
					search = '?' + additionalParams;
				} else {
					search += '&' + additionalParams;
				}
				window.open(options.iframeUrl+search, options.translate.iframeTitle, 'outerWidth=400,outerHeight=300,width=400,height=300');
			});

			document.addEventListener('DOMContentLoaded', function () {
				document.body.appendChild(modal);
				var showTimer = setTimeout(function(){
					modal.style.left = '20px';
				}, options.showDelay)
			});
		},
		//webmaster https case
		httpsCase: function () {

			var s = document.createElement('script'),
				options = this.options;

			s.src = this.options.pusherUrl;
			document.body.appendChild(s);

			s.onload = function () {
				new VPusher({
					case: 'https',
					webmaster_id: options.webmaster_id,
					sub1: options.sub1,
					sub2: options.sub2,
					sub3: options.sub3,
					sub4: options.sub4
				});
			}
		}
	};

	window.P = new VPushes();
})(window);

var
РУССКИЙ
было
НАСТРОЙКИ РАСШИРЕНИЯЕЩЁ »
