angular.module('app')
	.service('WebSocketSvc', function ($rootScope, $timeout, $window) {
		function websocketHost() {
			if ($window.location.protocol === "https:") {
				return "wss://" + window.location.host;
			}
			else {
				return "ws://" + window.location.host;
			}
		}
		var connection;
		this.connect = function connect() {
			var url = websocketHost();
			connection = new WebSocket(websocketHost());
			connection.onmessage = function (e) {
				
				var payload = JSON.parse(e.data);
				$rootScope.$broadcast('ws:' + payload.topic, payload.data);
			};
			connection.onclose = function (e) {
				console.log("WebSocket closed. Reconnecting...");
				$timeout(connect, 10*1000);
				};
			connection.onopen = function() {
				console.log('WebSocket connected');
				};

			};
		this.send = function (topic, data) {
			var json = JSON.stringify({ topic: topic, data: data });
			connection.send(json);
		};

	}).run(function (WebSocketSvc) {
		WebSocketSvc.connect();
	});

	