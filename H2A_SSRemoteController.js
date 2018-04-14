//=============================================================================
// H2A_SSRemoteController.js
// by Had2Apps
// Version: 1.0
//=============================================================================

var H2APG = H2APG || {};

/*:
 * @plugindesc マップ上のイベントのセルフスイッチをリモコン操作します。
 * @author Had2Apps
 *
 *
 * @help
 *
 * H2APG.SSRemote(イベントID,"A/B/C/D",true/false);
 * H2APG.SSRemote("文字列が含まれるイベント名のイベント","A/B/C/D",true/false);
 *
 */

(function () {
	H2APG.SSRemote = function(a,b,c){
		if(typeof(a)!="string"){
			$gameSelfSwitches.setValue([$gameMap.mapId(),a,b],c);
		}else{
			var events = $gameMap.events().filter(function(v){
				return $dataMap.events[v._eventId].name.indexOf(a)>-1
			});
			events.forEach(function(v){
				$gameSelfSwitches.setValue([$gameMap.mapId(),v._eventId,b],c);
			})
			$gameSelfSwitches.setValue([$gameMap.mapId(),a,b],c);
		}
	};
})();
