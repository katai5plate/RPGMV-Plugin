//=============================================================================
// H2A_InitBomb_161.js v2.1
//=============================================================================

/*:
 * @plugindesc dataフォルダのJSONをほとんど白紙化します。(1.6.1以降専用)
 * @author Had2Apps
 *
 * @help
 *
 * 動作確認：1.6.1
 * 
 * ※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
 * ※※　！注意！
 * ※※　プロジェクトデータが大破損する可能性があるので、
 * ※※　必ずバックアップを取ってください！
 * ※※　（新規プロジェクトを作成した直後のタイミングでの実行を推奨します）
 * ※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
 * 
 * プラグインを有効にしてテストプレイを起動すると、ダイアログが開きます。
 * そこで「run」と入力することでJSONファイルを白紙化することができます。
 * 
 * 白紙化する内容は現状、作者が使いやすいように作られています。
 * 
 * 処理内容：
 * ・職業の一掃
 * ・スキルの一掃
 * ・アイテムの一掃
 * ・武器の一掃
 * ・防具の一掃
 * ・敵キャラの一掃
 * ・敵グループの一掃
 * ・ステートの一掃
 * ・タイプの完全削除
 * ・システム：初期パーティを１体のみに変更
 * ・システム：乗り物画像のクリア
 * ・システム：オプションをすべてオフ
 * ・システム：魔法スキルを一掃
 * ・システム：音楽をすべてクリア
 * ・システム：効果音の戦闘関連をクリア
 * ・システム：タイトル画像をクリア
 * ・戦闘背景をクリア
 * 
 * 次期アップデート予定：
 * ・オプション：効果音を全消しするかどうか
 * ・どの分類のどの部分を消すかを細かく設定できるようにする
 */

var H2A_InitBomb = H2A_InitBomb || {};
(function () {
    var fs = require("fs");
    var dir = process.cwd() + "/";

    var read = function (filepath) {
        return JSON.parse(fs.readFileSync(dir + filepath, "utf8"));
    };
    var write = function (filepath, content) {
        fs.writeFileSync(dir + filepath, JSON.stringify(content));
    };
    var rwone = function (filepath, change) {
        if (change != null) {
            write(filepath,
                [null,
                    Object.assign({}, read(filepath)[1], change)
                ]
            );
        } else {
            write(filepath, [null, read(filepath)[1]]);
        }
    };

    H2A_InitBomb = {
        process: function () {
            if (location.href.indexOf("?test") == -1) {
                alert("テストプレイ時に実行してください。");
                window.close();
            }
            var res = window.prompt(
                "JSONの白紙化を開始する場合は「run」と入力してください\n" +
                "※注意：完了してツクールを再起動すると元には戻せません！\n"
            );
            if (res != "run") {
                alert("JSONの白紙化をキャンセルしました。");
                window.close();
            }

            var data, path;
            /* System.json */
            path = "data/System.json";
            data = read(path);
            //BGM、効果音
            var music = [
                ["titleBgm", "battleBgm", "victoryMe", "defeatMe", "gameoverMe",],
                ["boat", "ship", "airship"],
            ];
            music[0].forEach(function (v) { data[v].name = "" });
            music[1].forEach(function (v) { data[v].bgm.name = "" });
            var mute = [7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20];
            mute.forEach(function (v, i) {
                data.sounds[v].name = "";
            });
            //その他
            music[1].forEach(function (v) { data[v].characterName = "" });
            data = Object.assign({}, data, {
                battleback1Name: "",
                battleback2Name: "",
                title1Name: "",
                title2Name: "",
                magicSkills: [],
                optDisplayTp: false,
                optDrawTitle: true,
                optExtraExp: false,
                optFloorDeath: false,
                optFollowers: false,
                optSideView: false,
                optSlipDeath: false,
                optTransparent: false,
                partyMembers: [1],
                elements: [""],
                skillTypes: [""],
                weaponTypes: [""],
                armorTypes: [""],
                equipTypes: [""],
            });
            write(path, data);

            /* その他 */
            rwone("data/Classes.json", {
                name: "",
                learnings: [],
                traits: [],
            });
            rwone("data/Skills.json", {
                name: "",
                note: "",
                iconIndex: 0,
            });
            rwone("data/Items.json", {
                name: "",
                iconIndex: 0,
            });
            rwone("data/Weapons.json", {
                name: "",
                iconIndex: 0,
                traits: [],
            });
            rwone("data/Armors.json", {
                name: "",
                iconIndex: 0,
                traits: [],
            });
            rwone("data/Enemies.json", {
                name: "",
                battlerName: "",
                actions: [],
                traits: [],
            });
            rwone("data/Troops.json", {
                name: "",
                members: "",
            });
            rwone("data/States.json", {
                name: "",
                note: "",
                iconIndex: 0,
                traits: [],
            });

            if (window.confirm("タイルセットを 1番 のみにしますか？")) {
                rwone("data/Tilesets.json");
            }
            if (window.confirm("アニメーションを 全削除 しますか？")) {
                rwone("data/Animations.json", {
                    animation1Hue: 0,
                    animation1Name: "",
                    animation2Hue: 0,
                    animation2Name: "",
                    frames: [],
                    id: 1,
                    name: "",
                    position: 1,
                    timings: [],
                });
            }

            alert("JSONの白紙化が完了しました。");
            alert(
                "書き換えたJSONをツクール本体と反映させるため、\n" +
                "「このまま」ツクールを再起動してください。\n" +
                "※プロジェクトの保存をしないでください"
            );
            window.close();
        },
    };

    window.onload = function () {
        H2A_InitBomb.process();
    }

})()
