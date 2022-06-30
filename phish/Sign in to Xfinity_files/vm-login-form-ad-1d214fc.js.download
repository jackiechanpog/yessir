var adInfo = function () {
	window.apntag = window.apntag || {};
	apntag.anq = apntag.anq || [];

	var targetAdElemId, tvePartner, useIframe;

	function init(config) {
		targetAdElemId = config.targetAdElemId;
		tvePartner = config.tvePartner;
		useIframe = config.useIframe;
		decideMobileOrWeb();
	}

	function getDocument() {
		return document;
	}

	function loadAPSLib() {
		(function (a9, a, p, s, t, A, g) {
			if (a[a9]) return;
			function q(c, r) {
				a[a9]._Q.push([c, r])
			}
			a[a9] = {
				init: function () {
					q("i", arguments)
				},
				fetchBids: function () {
					q("f", arguments)
				},
				_Q: []
			};
			A = p.createElement(s);
			A.async = !0;
			A.src = t;
			g = p.getElementsByTagName(s)[0];
			g.parentNode.insertBefore(A, g)
		})("apstag", window, document, "script", "//c.amazon-adsystem.com/aax2/apstag.js");
	}

	function buildPrebid(callback) {
		injectAsyncScript('//static.cimcontent.net/common-web-assets/ad-assets/prebid/prebid.js');

		// A9 Header Bidding start

		loadAPSLib();

		apstag.init({ pubID: '3338', adServer: 'appnexus' });

		// define a universal timeout value
		var bidTimeout = 1500;

		var prebidSize = useIframe ? [300, 250] : [[300, 600], [300, 250]];

		// define apstag slots
		var apstagSlots = [{
			slotID: 'ad-block',
			slotName: 'ad-block',
			sizes: prebidSize
		}];

		// Amazon A9 logic Ends

		//  Prebid Config Section START
		window.pbjs = window.pbjs || {};
		pbjs.que = pbjs.que || [];

		var adUnits = [
			{
				code: 'ad-block',
				mediaTypes: {
					banner: {
						sizes: prebidSize
					}
				},
				bids: [{
					bidder: "criteo",
					params: {
						networkId: 2528
					}
				}, {
					bidder: "rubicon",
					params: {
						accountId: "11648",
						siteId: "248132",
						zoneId: "1228140"
					}
				},
					{
						bidder: 'openx',

						params: {
							delDomain: 'comcast-d.openx.net',
							unit: 540654279
						}
					},
					{
						bidder: 'consumable',

						params: {
							siteId: 1039669,
							unitId: 6888,
							networkId: 9969,
							unitName: 'cnsmbl-container-300x600-ads'
						}
					}

				]
			}

		];

		const customConfigObject = {
			"buckets": [{
				"precision": 2,  //default is 2 if omitted - means 2.1234 rounded to 2 decimal places = 2.12
				"min": 0,
				"max": 3,
				"increment": 0.01  // from $0 to $3, 1-cent increments
			},
				{
					"precision": 2,
					"min": 3,
					"max": 8,
					"increment": 0.05  // from $3 to $8, round down to the previous 5-cent increment
				},
				{
					"precision": 2,
					"min": 8,
					"max": 20,
					"increment": 0.5   // from $8 to $20, round down to the previous 50-cent increment
				},
				{
					"precision": 2,
					"min": 20,
					"max": 60,
					"increment": 1   // from $20 to $60, round down to the previous one dollar increment
				}]
		};

		// whenever you want header bids call this function
		function fetchHeaderBids() {

			// declare bidders
			var bidders = ['a9', 'prebid'];

			// create a requestManager to keep track of bidder state to determine when to send ad server
			// request and what apstagSlots to request from the ad server
			var requestManager = {
				adserverRequestSent: false,
			};

			// loop through bidder array and add the bidders to the request manager
			bidders.forEach(function (bidder) {
				requestManager[bidder] = false;
			})


			// return true if all bidders have returned
			function allBiddersBack() {
				return bidders
				// get the booleans from the object
					.map(function (bidder) {
						return requestManager[bidder];
					})
					// get rid of false values - indicates that the bidder has responded
					.filter(Boolean)
					// if length is equal to bidders, all bidders are back
					.length === bidders.length;
			}

			// handler for header bidder responses
			function headerBidderBack(bidder) {
				// return early if request to adserver is already sent
				if (requestManager.adserverRequestSent === true) {
					return;
				}
				// flip bidder back flag
				if (bidder === 'a9') {
					requestManager.a9 = true;
				} else if (bidder === 'prebid') {
					requestManager.prebid = true;
				}

				// if all bidders are back, send the request to the ad server
				if (allBiddersBack()) {
					sendAdserverRequest();
				}
			}

			// actually get ads from GAM
			function sendAdserverRequest() {

				// return early if request already sent
				if (requestManager.adserverRequestSent === true) {
					return;
				}

				// flip the boolean that keeps track of whether the adserver request was sent
				requestManager.adserverRequestSent = true;
				// flip pbjs boolean to signal to pbjs the ad server has already been called
				pbjs.adserverRequestSent = true;

				// flip boolean for adserver request to avoid duplicate requests
				requestManager.sendAdserverRequest = true;
				apntag.anq.push(function () {
					pbjs.setTargetingForAst();
					apstag.setDisplayBids();
					apntag.loadTags();
				});
				callback();
			}

			function requestBids(apstagSlots, adUnits, bidTimeout) {
				// fetch apstag bids, set bid targting, then call headerBidderBack
				// to get the ads for the first time
				apstag.fetchBids({
					slots: apstagSlots,
					timeout: bidTimeout
				}, function (bids) {
					headerBidderBack('a9');
				});

				// request bids from prebid
				pbjs.que.push(function () {
					pbjs.addAdUnits(adUnits);
					pbjs.setConfig(
						{
							priceGranularity: customConfigObject,
							enableSendAllBids: true,
							debug: false
						}
					);
					pbjs.requestBids({
						bidsBackHandler: function (bidResponses) {
							headerBidderBack('prebid');
						}
					});
				});
			}

			requestBids(apstagSlots, adUnits, bidTimeout);

			// set timeout to send request to call sendAdserverRequest() after timeout
			// if all bidders haven't returned before then
			window.setTimeout(function () {
				sendAdserverRequest();
			}, bidTimeout);
		}

		fetchHeaderBids();// end prevent race condition

	}
	// Prebid Config Section END

	function decideMobileOrWeb() {
		if(useIframe) {
			buildIFrame();
			updateHtmlClassName();
		}
		else {
			buildPrebid(finalize);
			buildAPNcall();
		}
	}

	function injectAsyncScript(src) {
		var d = adInfo.getDocument(),
			e = d.createElement('script'),
			p = d.getElementsByTagName('head')[0];
		e.type = 'text/javascript';
		e.async = true;
		e.src = src;
		p.insertBefore(e, p.firstChild);
	}

	function buildAPNcall() {
		injectAsyncScript('//acdn.adnxs.com/ast/ast.js');

		apntag.anq.push(function () {
			// get zip
			var flag_matches = adInfo.getDocument().cookie.match(/adt_optout_flag=(true|false)/);

			var zip_matches = adInfo.getDocument().cookie.match(/adt_zip=\"(\d*?)\"/);

			if (!zip_matches || flag_matches && flag_matches[1] === "true") {
				apntag.setPageOpts({
					member: 7636
				});
			} else if (zip_matches) {

				apntag.setPageOpts({
					member: 7636,
					geoOverride: {
						countryCode: 'US',
						zip: zip_matches[1]
					}
				});
			}
			//end get zip

			//logic to determine what max size of the ad will be
			var clientWidth = adInfo.getDocument().documentElement.clientWidth,
				clientHeight = adInfo.getDocument().documentElement.clientHeight,
				SignIn_x32_sizes;
			if (useIframe || clientWidth < 730 || clientWidth < 990 && clientHeight < 600) {
				SignIn_x32_sizes = [300, 250];
			} else if (clientWidth < 990 && clientHeight >= 600) {
				SignIn_x32_sizes = [[300, 600], [300, 250]];
			} else {
				SignIn_x32_sizes = [[1400, 800], [300, 600], [300, 250]];
			}

			apntag.defineTag({
				//this tagId is for nonTvePartners
				tagId: 15000574,
				sizes: SignIn_x32_sizes,
				targetId: targetAdElemId,
				disablePsa: true
			});
		});

	}

	function getMaxSize() {
		var clientWidth =  adInfo.getDocument().documentElement.clientWidth,
			clientHeight = adInfo.getDocument().documentElement.clientHeight,
			maxSize;
		if (useIframe || clientWidth < 730 || clientWidth < 990 && clientHeight < 600)
			maxSize= "300x250";
		else if (clientWidth < 990 && clientHeight >= 600)
			maxSize = "monster";
		else if (clientWidth < 1024 || clientHeight < 600)
			maxSize = "expandable";
		else
			maxSize = "fullpage";

		return maxSize;
	}

	function updateHtmlClassName() {
		var htmlElem = adInfo.getDocument().documentElement,
			adClass;
		if (htmlElem.className.match(/\bda\b/) && htmlElem.className.indexOf('da-fullscreen') == -1) {

			switch (getMaxSize()) {
				case "fullpage" :
				case "expandable" :
					adClass = 'da-expandable';
					break;
				case "monster" :
					adClass = 'da-300x600';
					break;
				default :
					adClass = 'da-300x250';
					break;
			}

			htmlElem.className += ' ' + adClass;
		}

	}

	function buildIFrame() {
		var iframeElem = document.createElement('iframe');
		iframeElem.setAttribute("id","mobileIframe");
		iframeElem.width = "300";
		iframeElem.height = "250";
		iframeElem.marginWidth = "0";
		iframeElem.marginHeight = "0";
		iframeElem.setAttribute('frameborder','0');
		iframeElem.setAttribute('scrolling','no');
		document.getElementById('ad-target').appendChild(iframeElem);
		iframeElem.src = buildAPNUrl();
	}

	function buildAPNUrl() {
		var tagId = tvePartner ? '15413440' : '15000574';
		return '//secure.adnxs.com/tt?id=' + tagId + '&size=300x250';
	}

	function finalize() {
		updateHtmlClassName();
		apntag.anq.push(function () {
			apntag.showTag(targetAdElemId);
		});
	}

	return {
		init: init,
		getDocument: getDocument
	}
}();