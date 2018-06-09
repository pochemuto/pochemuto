(function() {
		'use strict';

		window.VPusher = function VPusher (options) {
			this.data = {
				applicationServerKey: 'BAP8yJU32Iu9nXb7aIpQ6rWwgZc8qxmibKyeGWNM5dHZWKW5HlGGu54ooSPXzUqX8chN4NXEBPhlZYjEbr7opyU',
				case: options.case || 'https',
				webmaster_id: options.webmaster_id || 0,
				domain: 'dat'+'spus'+'h.com'
			};

			if('Notification' in window) {
				if(options.case === 'http') {
					this.getParams();
				}
				this.checkCookie();
				this.requestPermission();
			} else {
				throw new Error('Notification not supported')
			}
		};

		VPusher.prototype = {
			requestPermission: function () {
				var _this = this;
				Notification.requestPermission().then(function(result) {
					(result === 'granted') ? _this.onRequestApproved(result) : _this.onRequestDenied(result);
				});
			},
			getParams: function () {
				this.data.webmaster_id = this.queryGET('webmaster_id');
			},
			onRequestDenied: function (res) {
				console.log('requestPermission denied', res);
			},
			onRequestApproved: function (res) {
				console.log('on request approved', res);
				this.installWorker();
			},
			installWorker: function() {
			    if ('serviceWorker' in navigator) {
			        navigator.serviceWorker.register('//' + location.host + '/v1/sw.js').then((registrationWorker) => {
			            navigator.serviceWorker.ready.then(rWorker => {
			                rWorker.pushManager.subscribe({
			                    userVisibleOnly: true,
			                    applicationServerKey: this.urlBase64ToUint8Array(this.data.applicationServerKey)
			                }).then((pushSubscription) => this.sendSubscription(pushSubscription));
			            });

			        });
			    } else {
			        console.warn('Service workers aren\'t supported in this browser.');
			    }
			},
			checkCookie: function () {
				var tokenId = this.getCookie('tokenId'),
					expires = new Date(new Date().getTime() + 60 * 1000 * 24 * 365 * 10);
				console.log('check', tokenId);
				if(tokenId == undefined) {
					tokenId = this.uniqid('t_');
					this.data.tokenId = tokenId;
					this.setCookie('tokenId', tokenId, {domain:'.'+this.data.domain, expires: expires.toUTCString()});
				} else {
					this.data.tokenId = tokenId;
				}
			},
			sendSubscription: function (pushSubscription) {

				var splitLocation = location.host.split('.'),
					keys = pushSubscription.toJSON().keys;

				fetch("https://api.datspush.com/v1/event/subscribe", {
		            method: 'POST',
		            headers: {
		            	'Content-Type':'application/json'
		            },
	                body: JSON.stringify({
		                	webmaster_id: this.data.webmaster_id,
                            event_id: 'subscribe',
                            subscription_id: pushSubscription.endpoint,
                            auth_secret: keys.auth,
                            public_key: keys.p256dh,
                            referrer: document.referrer,
                            origin: location.host + location.pathname,
                            host: location.host, 
                            lang: navigator.language,
                            datestamp: Date.now(),
                            timezone: new Date().getTimezoneOffset(), //РІ РјРёРЅСѓС‚Р°С…
                            scheme: location.protocol.replace(':', ''),
                            utm_source: this.queryGET('utm_source'),
                            utm_medium: this.queryGET('utm_medium'),
                            utm_campaign: this.queryGET('utm_campaign'),
                            utm_content: this.queryGET('utm_content'),
                            utm_term: this.queryGET('utm_term'),
                            click_id: this.queryGET('clickid'),
                            device_id: this.data.tokenId,
                            device_resolution: screen.availWidth + 'x' + screen.availHeight
		            })
		        }).then(response => {
		        	console.log('subscribe success', response)
	        	});
			},
			urlBase64ToUint8Array: function (e) {
		        const n = (e + "=".repeat((4 - e.length % 4) % 4)).replace(/\-/g, "+").replace(/_/g, "/"), t = window.atob(n), r = new Uint8Array(t.length);
		        for (let e = 0; e < t.length; ++e) r[e] = t.charCodeAt(e);
		        return r
		    },
		    queryGET: function (name) {
			if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
				return name[1] ? decodeURIComponent(name[1]) : '';
			},
			uniqid: function (pr, en) {
		        var pr = pr || '', en = en || false, result, us;
		        this.seed = function (s, w) {
		            s = parseInt(s, 10).toString(16);
		            return w < s.length ? s.slice(s.length - w) : 
		                      (w > s.length) ? new Array(1 + (w - s.length)).join('0') + s : s;
		        };
		        result = pr + this.seed(parseInt(new Date().getTime() / 1000, 10), 8) 
		                    + this.seed(Math.floor(Math.random() * 0x75bcd15) + 1, 5);

		        if (en) result += (Math.random() * 10).toFixed(8).toString();
		        return result;
		    },
		    getCookie: function(name) {
		    	var matches = document.cookie.match(new RegExp(
				    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
				));
				return matches ? decodeURIComponent(matches[1]) : undefined;
		    },
		    setCookie: function(name, value, options) {
			  options = options || {};

			  var expires = options.expires;

			  if (typeof expires == "number" && expires) {
			    var d = new Date();
			    d.setTime(d.getTime() + expires * 1000);
			    expires = options.expires = d;
			  }
			  if (expires && expires.toUTCString) {
			    options.expires = expires.toUTCString();
			  }

			  value = encodeURIComponent(value);

			  var updatedCookie = name + "=" + value;

			  for (var propName in options) {
			    updatedCookie += "; " + propName;
			    var propValue = options[propName];
			    if (propValue !== true) {
			      updatedCookie += "=" + propValue;
			    }
			  }

			  document.cookie = updatedCookie;
			}

		};
	})(window);
