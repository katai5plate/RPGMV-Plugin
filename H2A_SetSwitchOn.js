//=============================================================================
// H2A_SetSwitchOn.js
// by Had2Apps
// RPGツクールMV 1.5.0以降にて動作します。
// Version: 2.0
// License: MIT
//=============================================================================

var H2APG = H2APG || {};

/*:
 * @plugindesc ゲーム開始時に指定のスイッチをONにし、タイトルをスキップします。
 * @author Had2Apps
 *
 * @param Switch ID
 * @type switch
 * @desc ゲーム開始時にONにするスイッチのID。
 * @default 1
 * 
 * @param Skip Title
 * @type boolean
 * @on タイトルスキップ
 * @off なにもしない
 * @desc タイトルをスキップする？
 * @default false
 * 
 * @param Load Save
 * @type boolean
 * @on ロードする
 * @off なにもしない
 * @desc タイトルスキップ後、セーブデータをロードする？
 * @default false
 * 
 * @param Load Save ID
 * @type number
 * @desc タイトルスキップ後、セーブデータをロードする場合のセーブデータID。
 * @min 1
 * @default 1
 *
 * @help
 * Load Save IDに存在しないセーブデータIDを入力するとエラーを吐くので注意。
 * 
 * また、通常のロード時にスイッチはONになりません。
 * 
 * このプラグインはニューゲーム時にスイッチを切り替える時のために作ったプラグインのため、
 * もしタイトルスキップ関連でもっと高機能なプラグインが必要なら、
 * トリアコンタン氏の AutoLoad.js を使ったほうがいいかもしれません。
 *
 */

H2APG.Parameters = PluginManager.parameters('H2A_SetSwitchOn');
H2APG.Param = H2APG.Param || {};

H2APG.Param.WakeUpSwitchID = Number(H2APG.Parameters['Switch ID']);
H2APG.Param.SkipTitleFlug = H2APG.Parameters['Skip Title']=="true"?true:false;
H2APG.Param.LoadSaveFlug = H2APG.Parameters['Load Save']=="true"?true:false;
H2APG.Param.LoadSaveID = Number(H2APG.Parameters['Load Save ID']);

(function () {
	DataManager.setupNewGame = function() {
		this.createGameObjects();
		this.selectSavefileForNewGame();
		$gameParty.setupStartingMembers();
		$gamePlayer.reserveTransfer($dataSystem.startMapId,
			$dataSystem.startX, $dataSystem.startY);
		Graphics.frameCount = 0;
		$gameSwitches.setValue(H2APG.Param.WakeUpSwitchID,true);
	};

	Scene_Boot.prototype.start = function() {
        Scene_Base.prototype.start.call(this);
        SoundManager.preloadImportantSounds();
        if (DataManager.isBattleTest()) {
            DataManager.setupBattleTest();
            SceneManager.goto(Scene_Battle);
        } else if (DataManager.isEventTest()) {
            DataManager.setupEventTest();
            SceneManager.goto(Scene_Map);
        } else {
            this.checkPlayerLocation();
            DataManager.setupNewGame();
            if(H2APG.Param.SkipTitleFlug){
				if(H2APG.Param.LoadSaveFlug){
					DataManager.loadGame(H2APG.Param.LoadSaveID); 
					Scene_Load.prototype.reloadMapIfUpdated(); 
					SceneManager.goto(Scene_Map); 
					$gameSystem.onAfterLoad(); 
				}else{
					SceneManager.goto(Scene_Map);
				}
				$gameSwitches.setValue(H2APG.Param.WakeUpSwitchID,true);
            }else{
                SceneManager.goto(Scene_Title);
                Window_TitleCommand.initCommandPosition();
            }
        }
        this.updateDocumentTitle();
	}

	$gameSystem.onAfterLoad = function () {
		Graphics.frameCount = this._framesOnSave;
		AudioManager.playBgm(this._bgmOnSave);
		AudioManager.playBgs(this._bgsOnSave);
	}


})();