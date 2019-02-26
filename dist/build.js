define("pkframe/event/PkEvent", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PkEvent = /** @class */ (function () {
        function PkEvent(name, target) {
            this.id = ++PkEvent.id;
            this.listeners = [];
            this.target = target;
            this.name = name;
            PkEvent.events.push(this);
        }
        PkEvent.ignoreContext = function (context) {
            for (var i = 0; i < PkEvent.events.length; i++) {
                var event = PkEvent.events[i];
                var listeners = PkEvent.events[i].listeners;
                var tmpListeners = [];
                for (var j = 0; j < listeners.length; j++) {
                    var listener = listeners[j];
                    if (!listener.context.event) {
                        tmpListeners.push(listener);
                        continue;
                    }
                    if (listener.context.event.id !== context.event.id) {
                        tmpListeners.push(listener);
                    }
                    else {
                        // console.debug('ignore context:', context)
                    }
                }
                PkEvent.events[i].listeners = tmpListeners;
            }
        };
        PkEvent.prototype.add = function (key, callBack, context) {
            var context = context || {};
            var exist = false;
            // verifica se já não foi add
            for (var i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i].callBack.toString() === callBack.toString()
                    &&
                        this.listeners[i].context === context) {
                    exist = true;
                    break;
                }
            }
            ;
            if (!exist)
                this.listeners.push({ key: key, callBack: callBack, context: context });
            //
        };
        PkEvent.prototype.clear = function (key) {
            // clear all
            if (!key) {
                this.listeners = [];
            }
            else { // clear only key
                var tmpListeners = [];
                for (var i = 0; i < this.listeners.length; i++) {
                    if (key != this.listeners[i].key) {
                        tmpListeners.push(this.listeners[i]);
                    }
                }
                this.listeners = tmpListeners;
                return;
            }
        };
        PkEvent.prototype.dispatch = function (key) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _a, _b;
            for (var i = 0; i < this.listeners.length; i++) {
                if (key == this.listeners[i].key) {
                    var data = {
                        target: this.target // ho dispatch the event
                    };
                    // se houver contexto, manda pelo contexto
                    if (this.listeners[i].context) {
                        (_a = this.listeners[i].callBack).call.apply(_a, [this.listeners[i].context, data].concat(args));
                        continue;
                    }
                    // dispara sem contexto mesmo
                    (_b = this.listeners[i]).callBack.apply(_b, [data].concat(args));
                }
            }
        };
        PkEvent.id = 0;
        PkEvent.events = [];
        return PkEvent;
    }());
    exports.PkEvent = PkEvent;
});
define("pkframe/scene/transitions/Default", ["require", "exports", "pkframe/event/PkEvent", "pkframe/scene/PkTransition"], function (require, exports, PkEvent_1, PkTransition_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PkTransitionAnimation;
    (function (PkTransitionAnimation) {
        var Default = /** @class */ (function () {
            function Default() {
                this.event = new PkEvent_1.PkEvent('PkTADefault', this);
            }
            Default.prototype.start = function () {
                // animation here
                // ...
                this.event.dispatch(PkTransition_1.E.OnTransitionEndStart);
            };
            Default.prototype.end = function () {
                // animation here
                // ...
                this.event.dispatch(PkTransition_1.E.OnTransitionEndEnd);
            };
            return Default;
        }());
        PkTransitionAnimation.Default = Default;
    })(PkTransitionAnimation = exports.PkTransitionAnimation || (exports.PkTransitionAnimation = {}));
});
define("pkframe/scene/PkTransition", ["require", "exports", "pkframe/scene/transitions/Default"], function (require, exports, Default_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PkTransition = /** @class */ (function () {
        function PkTransition(scene) {
            this.transitionAnimation = new Default_1.PkTransitionAnimation.Default();
            // defaults
            this.clearWorld = true;
            this.clearCache = false;
            this.game = scene.game;
            this.scene = scene;
        }
        PkTransition.prototype.change = function (to) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.to = to;
            this.params = args;
            this.transitionAnimation.event.add(E.OnTransitionEndStart, this.endStartAnimation, this);
            this.transitionAnimation.event.add(E.OnTransitionEndEnd, this.endStartAnimation, this);
            this.transitionAnimation.start(); // anm out
        };
        // This is called when the state preload has finished and creation begins
        PkTransition.prototype.endStartAnimation = function (e) {
            console.log('111');
            // remove current scene
            this.scene.shutdown();
            this.scene.scene.stop();
            console.log('222');
            // get next
            var nextScene = this.game.scene.getScene(this.to);
            console.log('333');
            // change to next scene
            nextScene.events.on('transitionstart', function () {
                console.log('=== -scene render');
            });
            console.log('444');
            nextScene.scene.start();
            nextScene.initData = this.params;
        };
        return PkTransition;
    }());
    exports.PkTransition = PkTransition;
    var E;
    (function (E) {
        E.OnTransitionEndStart = "OnTransitionEndStart";
        E.OnTransitionEndEnd = "OnTransitionEndEnd";
    })(E = exports.E || (exports.E = {}));
});
define("pkframe/element/PkElement", ["require", "exports", "pkframe/event/PkEvent"], function (require, exports, PkEvent_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PkElement = /** @class */ (function (_super) {
        __extends(PkElement, _super);
        function PkElement(scene) {
            var _this = _super.call(this, scene, 0, 0) || this;
            _this.id = 0;
            _this.name = "PkElement-" + _this.id;
            // inicia gerenciador de eventos
            _this.event = new PkEvent_2.PkEvent('element-event-' + _this.id, _this);
            scene.add.existing(_this);
            _this.id = ++PkElement.id;
            return _this;
        }
        PkElement.prototype.getId = function () {
            return this.id;
        };
        PkElement.prototype.destroy = function () {
            // clear all events propagation many-to-many
            this.event.clear();
            PkEvent_2.PkEvent.ignoreContext(this);
            _super.prototype.destroy.call(this);
        };
        PkElement.id = 0;
        return PkElement;
    }(Phaser.GameObjects.Container));
    exports.PkElement = PkElement;
});
define("pkframe/scene/PKScene", ["require", "exports", "pkframe/scene/PkTransition", "pkframe/element/PkElement"], function (require, exports, PkTransition_2, PkElement_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PkScene = /** @class */ (function (_super) {
        __extends(PkScene, _super);
        function PkScene(config) {
            if (config === void 0) { config = {}; }
            var _this = _super.call(this, config) || this;
            _this.layers = [];
            _this.addLayer = function (layerName) {
                var exist = false;
                // check if already exist
                for (var i = 0; i < this.layers.length; i++) {
                    if (this.layers[i].name == layerName) {
                        exist = true;
                        break;
                    }
                }
                ;
                if (exist)
                    this.layers.splice(i, 1);
                //
                // add to layer
                this.layers.push({
                    name: layerName,
                    total: 0,
                    group: (new PkElement_1.PkElement(this)) // this.game.add.group()
                });
            };
            _this.addToLayer = function (layerName, element) {
                var exist = false;
                // check if already exist
                for (var i = 0; i < this.layers.length; i++) {
                    if (this.layers[i].name == layerName) {
                        exist = true;
                        break;
                    }
                }
                ;
                // if dont exist, wharever
                if (!exist)
                    return;
                //
                // add element to layer
                this.layers[i].group.add(element);
                // order layers
                for (var i = 0; i < this.layers.length; i++)
                    this.children.bringToTop(this.layers[i].group);
                //
            };
            return _this;
        }
        PkScene.prototype.init = function () {
            this.transition = new PkTransition_2.PkTransition(this);
        };
        PkScene.prototype.preload = function () {
            this.transition.transitionAnimation.end();
        };
        PkScene.prototype.getGame = function () {
            return this.game;
        };
        PkScene.prototype.getLayer = function (layerName) {
            for (var i = 0; i < this.layers.length; i++)
                if (this.layers[i].name == layerName)
                    return this.layers[i];
            //
            return null;
        };
        PkScene.prototype.bringLayerToTop = function (layerName) {
            for (var i = 0; i < this.layers.length; i++) {
                if (this.layers[i].name == layerName) {
                    this.children.bringToTop(this.layers[i].group);
                    // console.log('bring ' + this.layers[i].name + ' to top')
                }
            }
            //
        };
        PkScene.prototype.create = function () {
        };
        PkScene.prototype.shutdown = function () {
        };
        return PkScene;
    }(Phaser.Scene));
    exports.PkScene = PkScene;
});
define("pkframe/PkLoader", ["require", "exports", "pkframe/scene/PKScene", "pkframe/PkGame"], function (require, exports, PKScene_1, PkGame_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PkLoader = /** @class */ (function (_super) {
        __extends(PkLoader, _super);
        function PkLoader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PkLoader.prototype.init = function () {
        };
        PkLoader.prototype.preload = function () {
            // console.log('preload!')
            // this.load.setPreloadSprite(this.add.sprite(200, 250, 'pk-loading-bar'));
        };
        PkLoader.prototype.create = function () {
            var _this = this;
            setTimeout(function () {
                // if initial state set, load
                if (PkGame_1.PkGame.pkConfig.initialState != '') {
                    _this.game.scene.start(PkGame_1.PkGame.pkConfig.initialState);
                }
                // remove loader screen
                _this.game.scene.remove('PkLoader');
            }, PkGame_1.PkGame.pkConfig.loaderWaitingTime);
        };
        return PkLoader;
    }(PKScene_1.PkScene));
    exports.PkLoader = PkLoader;
});
define("pkframe/PkConfig", ["require", "exports", "pkframe/PkLoader", "pkframe/PkGame"], function (require, exports, PkLoader_1, PkGame_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PkConfig = /** @class */ (function () {
        function PkConfig() {
            this.canvasSize = [1024, 768]; // width, height
            this.canvasContainerId = 'game-container';
            this.initialState = ''; // initial state after loadscreen
            // loading settings
            this.loaderLoadingBar = ''; // loading bar
            this.loaderWaitingTime = 1000; // 1 sec
            this.loaderState = PkLoader_1.PkLoader;
            this.preLoaderState = PkGame_2.PkLoaderPreLoader;
        }
        return PkConfig;
    }());
    exports.PkConfig = PkConfig;
});
define("pkframe/PkGame", ["require", "exports", "pkframe/PkConfig", "pkframe/scene/PKScene"], function (require, exports, PkConfig_1, PKScene_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PkGame = /** @class */ (function (_super) {
        __extends(PkGame, _super);
        function PkGame(pkConfig) {
            if (pkConfig === void 0) { pkConfig = new PkConfig_1.PkConfig(); }
            var _this = this;
            var config = {
                type: Phaser.AUTO,
                width: pkConfig.canvasSize[0],
                height: pkConfig.canvasSize[1],
                parent: pkConfig.canvasContainerId
            };
            _this = _super.call(this, config) || this;
            PkGame.pkConfig = pkConfig;
            // add states
            _this.scene.add('PkLoaderPreLoader', PkGame.pkConfig.preLoaderState, true);
            PkGame.game = _this;
            return _this;
            // console.log('PK Game init')
        }
        PkGame.prototype.preload = function () {
        };
        PkGame.prototype.create = function () {
        };
        return PkGame;
    }(Phaser.Game));
    exports.PkGame = PkGame;
    var PkLoaderPreLoader = /** @class */ (function (_super) {
        __extends(PkLoaderPreLoader, _super);
        function PkLoaderPreLoader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PkLoaderPreLoader.prototype.init = function () {
            // add loader screen
            this.game.scene.add('PkLoader', PkGame.pkConfig.loaderState);
        };
        PkLoaderPreLoader.prototype.preload = function () {
            // load loadingbar sprite
            if (PkGame.pkConfig.loaderLoadingBar != '')
                this.load.image('pk-loading-bar', PkGame.pkConfig.loaderLoadingBar);
            //
        };
        PkLoaderPreLoader.prototype.create = function () {
            // change to preloader screen*
            this.game.scene.start('PkLoader');
        };
        return PkLoaderPreLoader;
    }(PKScene_2.PkScene));
    exports.PkLoaderPreLoader = PkLoaderPreLoader;
});
define("pkframe/utils/PkUtils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PkUtils = /** @class */ (function () {
        function PkUtils() {
        }
        // check if is a empty object
        PkUtils.isEmpty = function (obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop))
                    return false;
            }
            return true && JSON.stringify(obj) === JSON.stringify({});
        };
        PkUtils.createSquareBitmap = function (scene, width, height, color) {
            if (color === void 0) { color = 0x000000; }
            var recGraph = scene.add.graphics({ x: 0, y: 0 });
            /*
        bmd.ctx.beginPath();
        bmd.ctx.rect(0, 0, width, height);
        bmd.ctx.fillStyle = color;
        bmd.ctx.fill();
        return bmd;
        */
            recGraph.fillStyle(color, 1);
            //  32px radius on the corners
            recGraph.fillRect(0, 0, width, height);
            return recGraph;
            // Phaser.GameObjects.Graphics.Bit
        };
        PkUtils.createSquare = function (scene, width, height, color) {
            if (color === void 0) { color = 0x000000; }
            var textureName = width + '-' + height + '-' + color.toString();
            // create texture if not exist
            if (scene.textures.getTextureKeys().indexOf(textureName) == -1) {
                var bmd = PkUtils.createSquareBitmap(scene, width, height, color);
                bmd.generateTexture(textureName, width, height);
                bmd.destroy();
            }
            var s = scene.add.sprite(0, 0, textureName);
            s.setOrigin(0, 0);
            return s;
        };
        /*
            static createCircle(scene:Phaser.Scene, diameter:number, color:string = "#000000"):Phaser.GameObjects.Sprite
            {
                var circleBtm:Phaser.GameObjects.Graphics = scene.add.graphics({x:0, y:0});
                //	Shapes drawn to the Graphics object must be filled.
                // circleBtm.beginFill(0xffffff);
        
                //	Here we'll draw a circle
                // circleBtm.drawCircle(0, 0, diameter);
                // circleBtm.generateTexture()
        
                return scene.add.sprite(0, 0, circleBtm);
            }
        */
        PkUtils.slugify = function (text, separator) {
            text = text.toString().toLowerCase().trim();
            var sets = [
                { to: 'a', from: '[ÀÁÂÃÄÅÆĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶ]' },
                { to: 'c', from: '[ÇĆĈČ]' },
                { to: 'd', from: '[ÐĎĐÞ]' },
                { to: 'e', from: '[ÈÉÊËĒĔĖĘĚẸẺẼẾỀỂỄỆ]' },
                { to: 'g', from: '[ĜĞĢǴ]' },
                { to: 'h', from: '[ĤḦ]' },
                { to: 'i', from: '[ÌÍÎÏĨĪĮİỈỊ]' },
                { to: 'j', from: '[Ĵ]' },
                { to: 'ij', from: '[Ĳ]' },
                { to: 'k', from: '[Ķ]' },
                { to: 'l', from: '[ĹĻĽŁ]' },
                { to: 'm', from: '[Ḿ]' },
                { to: 'n', from: '[ÑŃŅŇ]' },
                { to: 'o', from: '[ÒÓÔÕÖØŌŎŐỌỎỐỒỔỖỘỚỜỞỠỢǪǬƠ]' },
                { to: 'oe', from: '[Œ]' },
                { to: 'p', from: '[ṕ]' },
                { to: 'r', from: '[ŔŖŘ]' },
                { to: 's', from: '[ßŚŜŞŠ]' },
                { to: 't', from: '[ŢŤ]' },
                { to: 'u', from: '[ÙÚÛÜŨŪŬŮŰŲỤỦỨỪỬỮỰƯ]' },
                { to: 'w', from: '[ẂŴẀẄ]' },
                { to: 'x', from: '[ẍ]' },
                { to: 'y', from: '[ÝŶŸỲỴỶỸ]' },
                { to: 'z', from: '[ŹŻŽ]' },
                { to: '-', from: '[·/_,:;\']' }
            ];
            sets.forEach(function (set) {
                text = text.replace(new RegExp(set.from, 'gi'), set.to);
            });
            text = text.toString().toLowerCase()
                .replace(/\s+/g, '-') // Replace spaces with -
                .replace(/&/g, '-and-') // Replace & with 'and'
                .replace(/[^\w\-]+/g, '') // Remove all non-word chars
                .replace(/\--+/g, '-') // Replace multiple - with single -
                .replace(/^-+/, '') // Trim - from start of text
                .replace(/-+$/, ''); // Trim - from end of text
            if ((typeof separator !== 'undefined') && (separator !== '-')) {
                text = text.replace(/-/g, separator);
            }
            return text;
        };
        return PkUtils;
    }());
    exports.PkUtils = PkUtils;
});
define("game/Loader", ["require", "exports", "pkframe/PkGame", "pkframe/PkLoader", "pkframe/utils/PkUtils"], function (require, exports, PkGame_3, PkLoader_2, PkUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Preloader = /** @class */ (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Preloader.prototype.preload = function () {
            // utils / vendor
            this.load.script('WebFont', 'src/pkframe/vendor/webfontloader.js');
            // load game loading bar
            this.load.image('game-loading-bar', 'assets/scenes/default/images/loading-bar.png');
            // load game loading logo
            // this.load.image('game-loading-logo', 'assets/states/loader/images/logo.png');
        };
        return Preloader;
    }(PkGame_3.PkLoaderPreLoader));
    exports.Preloader = Preloader;
    var Loader = /** @class */ (function (_super) {
        __extends(Loader, _super);
        function Loader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Loader.prototype.init = function () {
            _super.prototype.init.call(this);
        };
        Loader.prototype.preload = function () {
            var _this = this;
            // ignore preloading bar
            _super.prototype.preload.call(this);
            // create custom loading bar
            this.loadingBar = PkUtils_1.PkUtils.createSquare(this, (this.game.canvas.width / 1.5), 5, 0xFFFFFF);
            // pos loading bar on bot
            this.loadingBar.y = this.game.canvas.height / 2 - this.loadingBar.height / 2;
            this.loadingBar.x = this.game.canvas.width / 2 - this.loadingBar.width / 2;
            this.load.on('progress', function (value) {
                var v = Math.round(value * 100);
                _this.loadingBar.scaleX = (v * 0.01);
            });
            this.load.on('complete', function (value) {
                console.log('load complete');
            });
            /*
            // dumb test asset
            for (let index = 0; index < 200; index++)
                this.load.image('game-loading-bar' + index, 'assets/scenes/default/images/loading-bar.png');
            // */
            // walls
            this.load.image('wall-middle', 'assets/default/sprites/wall_mid.png');
            this.load.image('wall-top-middle', 'assets/default/sprites/wall_top_mid.png');
            // wall collun
            this.load.image('wall-column-middle', 'assets/default/sprites/wall_column_mid.png');
            // bg - fade
            this.load.image('bg-fade-right', 'assets/default/sprites/bg-fade-right.png');
            // animations
            // knight
            this.load.image('knight-idle-1', 'assets/default/sprites/knight_m_idle_anim_f0.png');
            this.load.image('knight-idle-2', 'assets/default/sprites/knight_m_idle_anim_f1.png');
            this.load.image('knight-idle-3', 'assets/default/sprites/knight_m_idle_anim_f2.png');
            this.load.image('knight-idle-4', 'assets/default/sprites/knight_m_idle_anim_f3.png');
            this.load.image('knight-run-1', 'assets/default/sprites/knight_f_run_anim_f0.png');
            this.load.image('knight-run-2', 'assets/default/sprites/knight_f_run_anim_f1.png');
            this.load.image('knight-run-3', 'assets/default/sprites/knight_f_run_anim_f2.png');
            this.load.image('knight-run-4', 'assets/default/sprites/knight_f_run_anim_f3.png');
            // mage
            this.load.image('mage-idle-1', 'assets/default/sprites/wizzard_m_idle_anim_f0.png');
            this.load.image('mage-idle-2', 'assets/default/sprites/wizzard_m_idle_anim_f1.png');
            this.load.image('mage-idle-3', 'assets/default/sprites/wizzard_m_idle_anim_f2.png');
            this.load.image('mage-idle-4', 'assets/default/sprites/wizzard_m_idle_anim_f3.png');
            // rogue
            this.load.image('rogue-idle-1', 'assets/default/sprites/elf_m_idle_anim_f0.png');
            this.load.image('rogue-idle-2', 'assets/default/sprites/elf_m_idle_anim_f1.png');
            this.load.image('rogue-idle-3', 'assets/default/sprites/elf_m_idle_anim_f2.png');
            this.load.image('rogue-idle-4', 'assets/default/sprites/elf_m_idle_anim_f3.png');
            //  ** ADDING Other things  ** //
            // this.load.image('cinematic-bg', 'assets/states/intro/images/cinematic-bg.jpg');
            // this.load.audio('intro-sound', 'assets/states/intro/sounds/intro.mp3');
            // this.load.spritesheet('char1-idle', 'assets/default/images/chars/heroes/1/iddle.png', 158, 263, 12);
        };
        Loader.prototype.create = function () {
            _super.prototype.create.call(this);
        };
        return Loader;
    }(PkLoader_2.PkLoader));
    exports.Loader = Loader;
});
define("game/elements/Characters/Base", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("game/elements/Characters/Character", ["require", "exports", "pkframe/element/PkElement"], function (require, exports, PkElement_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Character = /** @class */ (function (_super) {
        __extends(Character, _super);
        function Character(scene) {
            var _this = _super.call(this, scene) || this;
            // meta
            _this.name = "Char-Name";
            // stats
            _this.hp = 1; // health points
            _this.atk = 1; // attack
            return _this;
        }
        Character.prototype.create = function () {
            if (this.animationIdle)
                this.spriteBase = this.scene.add.sprite(0, 0, this.animationIdle.frames[0].textureKey);
            else
                this.spriteBase = this.scene.add.sprite(0, 0, '');
            //
            this.spriteBase.setOrigin(0, 0);
            this.add(this.spriteBase);
            this.idle();
        };
        Character.prototype.attack = function (char) {
            return 0;
        };
        Character.prototype.idle = function () {
            this.spriteBase.play('idle' + this.getId());
        };
        Character.prototype.idleStop = function () {
            this.spriteBase.anims.stop();
        };
        return Character;
    }(PkElement_2.PkElement));
    exports.Character = Character;
});
define("game/elements/Characters/Monster", ["require", "exports", "game/elements/Characters/Character"], function (require, exports, Character_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Monster = /** @class */ (function (_super) {
        __extends(Monster, _super);
        function Monster() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            // meta
            _this.name = "Monster";
            // stats
            _this.hp = 1; // health points
            _this.atk = 1; // attack
            _this.def = 1; // defense
            return _this;
        }
        Monster.prototype.attack = function (hero) {
            return 0;
        };
        return Monster;
    }(Character_1.Character));
    exports.Monster = Monster;
});
define("game/elements/Characters/Hero", ["require", "exports", "game/elements/Characters/Character"], function (require, exports, Character_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Hero = /** @class */ (function (_super) {
        __extends(Hero, _super);
        function Hero(scene) {
            var _this = _super.call(this, scene) || this;
            // meta
            _this.name = "Hero";
            // stats
            _this.ap = 3; // action points
            return _this;
        }
        Hero.prototype.create = function () {
            _super.prototype.create.call(this);
        };
        Hero.prototype.attack = function (monster) {
            return 0;
        };
        Hero.prototype.run = function () {
            this.spriteBase.play('run' + this.getId());
        };
        return Hero;
    }(Character_2.Character));
    exports.Hero = Hero;
});
define("game/elements/Characters/Heroes/Knight", ["require", "exports", "game/elements/Characters/Hero"], function (require, exports, Hero_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Knight = /** @class */ (function (_super) {
        __extends(Knight, _super);
        function Knight(scene) {
            var _this = _super.call(this, scene) || this;
            // meta
            _this.name = "Knight";
            // stats
            _this.ap = 2; // action points
            _this.hp = 6; // health points
            _this.atk = 2; // attack
            _this.animationIdle = _this.scene.anims.create({
                key: 'idle' + _this.getId(),
                frames: [
                    { key: 'knight-idle-1' },
                    { key: 'knight-idle-2' },
                    { key: 'knight-idle-3' },
                    { key: 'knight-idle-4' }
                ],
                frameRate: 8,
                repeat: -1
            });
            _this.animationRun = _this.scene.anims.create({
                key: 'run' + _this.getId(),
                frames: [
                    { key: 'knight-run-1' },
                    { key: 'knight-run-2' },
                    { key: 'knight-run-3' },
                    { key: 'knight-run-4' }
                ],
                frameRate: 8,
                repeat: -1
            });
            return _this;
        }
        return Knight;
    }(Hero_1.Hero));
    exports.Knight = Knight;
});
define("game/elements/Text/MiniText", ["require", "exports", "pkframe/element/PkElement"], function (require, exports, PkElement_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MiniText = /** @class */ (function (_super) {
        __extends(MiniText, _super);
        function MiniText(scene, text, duration) {
            if (duration === void 0) { duration = 400; }
            var _this = _super.call(this, scene) || this;
            _this.style = {
                fontFamily: 'I Pixel U',
                fontSize: 14,
                color: "#ffffff"
            };
            _this.centralized = true;
            _this.text = text;
            _this.duration = duration;
            return _this;
        }
        MiniText.prototype.create = function () {
            this.txtObj = this.scene.add.text(0, 0, this.text, this.style);
            this.txtObj.setStroke("#000", 5);
            this.add(this.txtObj);
        };
        MiniText.prototype.play = function () {
            if (!this.scene)
                return;
            //
            if (this.centralized) {
                this.x = this.scene.game.canvas.width / 2 - this.txtObj.width / 2;
                this.y = this.scene.game.canvas.height / 2 - this.txtObj.height / 2;
                this.y -= 2;
            }
            this.visible = true;
        };
        MiniText.prototype.ploff = function () {
            this.visible = false;
        };
        return MiniText;
    }(PkElement_3.PkElement));
    exports.MiniText = MiniText;
});
define("game/elements/Text/MiniPhrase", ["require", "exports", "pkframe/element/PkElement", "game/elements/Text/MiniText", "pkframe/utils/PkUtils"], function (require, exports, PkElement_4, MiniText_1, PkUtils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var E;
    (function (E) {
        E.OnPhaseEnd = "OnPhaseEnd";
    })(E = exports.E || (exports.E = {}));
    var MiniPhrase = /** @class */ (function (_super) {
        __extends(MiniPhrase, _super);
        function MiniPhrase() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.texts = new Array();
            return _this;
        }
        MiniPhrase.prototype.create = function () {
            this.bg = PkUtils_2.PkUtils.createSquare(this.scene, this.scene.game.canvas.width, this.scene.game.canvas.height);
            this.bg.visible = false;
            this.add(this.bg);
            for (var i in this.texts) {
                this.texts[i].create();
                this.texts[i].visible = false;
            }
        };
        MiniPhrase.prototype.addText = function (text) {
            this.texts.push(text);
            this.add(text);
        };
        MiniPhrase.prototype.play = function () {
            var _this = this;
            var cc = 0;
            var lst = 0; // last duration
            // show bg
            if (this.texts.length)
                this.bg.visible = true;
            var _loop_1 = function (i) {
                var miniText = this_1.texts[i];
                this_1.bringToTop(miniText);
                setTimeout(function () {
                    miniText.play(); // in
                }, lst);
                setTimeout(function () {
                    miniText.ploff(); // out
                    // if last
                    if (parseInt(i) >= _this.texts.length - 1) {
                        _this.event.dispatch(E.OnPhaseEnd);
                        _this.bg.visible = false;
                    }
                }, miniText.duration + lst);
                lst += miniText.duration;
                cc++;
            };
            var this_1 = this;
            //
            for (var i in this.texts) {
                _loop_1(i);
            }
        };
        MiniPhrase.build = function (scene, texts) {
            var mp = new MiniPhrase(scene);
            var mtxs = new Array();
            for (var i in texts) {
                var mt = new MiniText_1.MiniText(scene, texts[i].text, texts[i].duration);
                mp.addText(mt);
            }
            //
            mp.create();
            return mp;
        };
        return MiniPhrase;
    }(PkElement_4.PkElement));
    exports.MiniPhrase = MiniPhrase;
});
define("pkframe/scene/transitions/Slide", ["require", "exports", "pkframe/event/PkEvent", "pkframe/scene/PkTransition"], function (require, exports, PkEvent_3, PkTransition_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PkTransitionSlide = /** @class */ (function () {
        function PkTransitionSlide(scene) {
            this.event = new PkEvent_3.PkEvent('Transitions.Slide', this);
            this.changeTime = 300; // ms
            this.scene = scene;
        }
        PkTransitionSlide.prototype.start = function () {
            var _this = this;
            // create bg
            var points = [
                (this.scene.game.canvas.width / 2) * (-1), 0,
                this.scene.game.canvas.width, 0,
                this.scene.game.canvas.width, this.scene.game.canvas.height,
                0, this.scene.game.canvas.height // 3
            ];
            var poly = this.scene.add.polygon(this.scene.game.canvas.width * 1.5, 0, points, 0x000000);
            poly.setOrigin(0, 0);
            this.scene.add.tween({
                targets: poly,
                x: 0,
                duration: this.changeTime,
                onComplete: function () {
                    // dispatch end transition | mandatory
                    _this.event.dispatch(PkTransition_3.E.OnTransitionEndStart);
                },
                onUpdate: function () {
                    _this.scene.children.bringToTop(poly);
                }
            });
        };
        PkTransitionSlide.prototype.end = function () {
            var _this = this;
            this.scene.scene.setVisible(false);
            var points = [
                0, 0,
                this.scene.game.canvas.width, 0,
                this.scene.game.canvas.width + (this.scene.game.canvas.width / 2), this.scene.game.canvas.height,
                0, this.scene.game.canvas.height // 3
            ];
            var poly = this.scene.add.polygon(0, 0, points, 0x000000);
            poly.setOrigin(0, 0);
            this.scene.add.tween({
                targets: poly,
                x: -(this.scene.game.canvas.width * 1.5),
                duration: this.changeTime,
                onComplete: function () {
                    // dispatch end transition | mandatory
                    _this.event.dispatch(PkTransition_3.E.OnTransitionEndEnd);
                },
                onUpdate: function () {
                    _this.scene.children.bringToTop(poly);
                    _this.scene.scene.setVisible(true);
                }
            });
        };
        return PkTransitionSlide;
    }());
    exports.PkTransitionSlide = PkTransitionSlide;
});
define("game/scenes/Main", ["require", "exports", "pkframe/scene/PKScene", "game/elements/Characters/Heroes/Knight", "game/elements/Text/MiniPhrase", "pkframe/scene/transitions/Slide", "pkframe/utils/PkUtils"], function (require, exports, PKScene_3, Knight_1, MiniPhrase_1, Slide_1, PkUtils_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Main = /** @class */ (function (_super) {
        __extends(Main, _super);
        function Main() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.wallCollumns = new Array();
            _this.timeouts = new Array();
            return _this;
        }
        Main.prototype.init = function () {
            _super.prototype.init.call(this);
            this.transition.transitionAnimation = new Slide_1.PkTransitionSlide(this);
        };
        Main.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);
            this.addLayer('scene-bg');
            this.addLayer('characters');
            this.addLayer('scene-front');
            this.addLayer('scene-front-front'); // kek
            this.wallMiddleTile = this.add.tileSprite(0, 0, this.game.canvas.width, this.game.canvas.height, 'wall-middle');
            this.wallBottomMiddleTile = this.add.tileSprite(0, -12, this.game.canvas.width, 16, 'wall-top-middle');
            this.wallMiddleTile.setOrigin(0, 0);
            this.wallBottomMiddleTile.setOrigin(0, 0);
            this.wallMiddleTile.alpha = 0.7;
            this.wallBottomMiddleTile.alpha = 0.5;
            this.addToLayer('scene-bg', this.wallMiddleTile);
            this.addToLayer('scene-bg', this.wallBottomMiddleTile);
            // bg fade
            var bgFade = this.add.sprite(0, 0, 'bg-fade-right');
            bgFade.setOrigin(0, 0);
            this.addToLayer('scene-front', bgFade);
            var blinkTime = 800;
            this.clickTokPlay = MiniPhrase_1.MiniPhrase.build(this, [
                { text: '*CLICK*', duration: blinkTime },
                { text: 'TO', duration: blinkTime },
                { text: 'PLAY', duration: blinkTime },
            ]);
            this.clickTokPlay.create();
            this.addToLayer('scene-front-front', this.clickTokPlay);
            var startGameClickArea = PkUtils_3.PkUtils.createSquare(this, this.game.canvas.width, this.game.canvas.height, 0x0000FF);
            startGameClickArea.alpha = 0.01;
            startGameClickArea.setInteractive({ useHandCursor: true });
            startGameClickArea.on('pointerup', function (pointer) {
                _this.transition.change('HeroSelect');
            });
            var knight = new Knight_1.Knight(this);
            knight.create();
            knight.x += 7;
            knight.y -= 3;
            knight.run();
            this.addToLayer('characters', knight);
            // creating collumn - back
            var tid = setInterval(function () {
                var wallCollumnMiddle = _this.add.tileSprite(0, 0, 16, _this.game.canvas.height, 'wall-column-middle');
                wallCollumnMiddle.setOrigin(0, 0);
                wallCollumnMiddle.x += _this.game.canvas.width;
                _this.addToLayer('scene-bg', wallCollumnMiddle);
                _this.wallCollumns.push(wallCollumnMiddle);
                console.log('- Drop Collumn -');
                // this.children.bringToTop(knight);
            }, 2105);
            this.timeouts.push(tid);
            var tid = setInterval(function () {
                var wallCollumnMiddle = _this.add.tileSprite(0, 0, 16, _this.game.canvas.height, 'wall-column-middle');
                wallCollumnMiddle.setOrigin(0, 0);
                wallCollumnMiddle.x += _this.game.canvas.width;
                // wallCollumnMiddle.tint = 0;
                _this.addToLayer('scene-front', wallCollumnMiddle);
                _this.wallCollumns.push(wallCollumnMiddle);
            }, 3500);
            this.timeouts.push(tid);
            var tid = setInterval(function () {
                _this.clickTokPlay.play();
            }, 1000 * 10); // 10 sec
            this.timeouts.push(tid);
            this.timeouts.push(setTimeout(function () {
                _this.clickTokPlay.play();
            }, 500));
        };
        Main.prototype.update = function () {
            this.wallMiddleTile.tilePositionX += 0.8;
            this.wallBottomMiddleTile.tilePositionX += 0.8;
            for (var i in this.wallCollumns) {
                this.wallCollumns[i].x -= 0.8;
                if (this.wallCollumns[i].x < 0 - this.wallCollumns[i].width) {
                    this.wallCollumns[i].destroy();
                    this.wallCollumns.splice(i, 1);
                }
            }
        };
        Main.prototype.shutdown = function () {
            for (var i in this.timeouts)
                clearInterval(this.timeouts[i]);
            //
        };
        return Main;
    }(PKScene_3.PkScene));
    exports.Main = Main;
});
define("game/Types", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var T;
    (function (T) {
        var Heroes;
        (function (Heroes) {
            Heroes[Heroes["KNIGHT"] = 0] = "KNIGHT";
            Heroes[Heroes["MAGE"] = 1] = "MAGE";
            Heroes[Heroes["ROGUE"] = 2] = "ROGUE";
        })(Heroes = T.Heroes || (T.Heroes = {}));
    })(T = exports.T || (exports.T = {}));
});
define("game/elements/Characters/Heroes/Mage", ["require", "exports", "game/elements/Characters/Hero"], function (require, exports, Hero_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Mage = /** @class */ (function (_super) {
        __extends(Mage, _super);
        function Mage(scene) {
            var _this = _super.call(this, scene) || this;
            // meta
            _this.name = "Mage";
            // stats
            _this.ap = 3; // action points
            _this.hp = 3; // health points
            _this.atk = 4; // attack
            _this.animationIdle = _this.scene.anims.create({
                key: 'idle' + _this.getId(),
                frames: [
                    { key: 'mage-idle-1' },
                    { key: 'mage-idle-2' },
                    { key: 'mage-idle-3' },
                    { key: 'mage-idle-4' }
                ],
                frameRate: 8,
                repeat: -1
            });
            return _this;
        }
        return Mage;
    }(Hero_2.Hero));
    exports.Mage = Mage;
});
define("game/elements/Characters/Heroes/Rogue", ["require", "exports", "game/elements/Characters/Hero"], function (require, exports, Hero_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Rogue = /** @class */ (function (_super) {
        __extends(Rogue, _super);
        function Rogue(scene) {
            var _this = _super.call(this, scene) || this;
            // meta
            _this.name = "Rogue";
            // stats
            _this.ap = 5; // action points
            _this.hp = 2; // health points
            _this.atk = 4; // attack
            _this.animationIdle = _this.scene.anims.create({
                key: 'idle' + _this.getId(),
                frames: [
                    { key: 'rogue-idle-1' },
                    { key: 'rogue-idle-2' },
                    { key: 'rogue-idle-3' },
                    { key: 'rogue-idle-4' }
                ],
                frameRate: 8,
                repeat: -1
            });
            return _this;
        }
        return Rogue;
    }(Hero_3.Hero));
    exports.Rogue = Rogue;
});
define("game/scenes/GameScene", ["require", "exports", "pkframe/scene/PKScene", "game/Types", "game/elements/Characters/Heroes/Knight", "game/elements/Characters/Heroes/Mage", "game/elements/Characters/Heroes/Rogue", "pkframe/scene/transitions/Slide"], function (require, exports, PKScene_4, Types_1, Knight_2, Mage_1, Rogue_1, Slide_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GameScene = /** @class */ (function (_super) {
        __extends(GameScene, _super);
        function GameScene() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GameScene.prototype.init = function () {
            _super.prototype.init.call(this);
            this.transition.transitionAnimation = new Slide_2.PkTransitionSlide(this);
        };
        GameScene.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);
            console.log('- GameScene create ');
            if (!this.initData.length)
                return;
            //
            switch (this.initData[0]) {
                case Types_1.T.Heroes.KNIGHT:
                    this.hero = new Knight_2.Knight(this);
                    break;
                case Types_1.T.Heroes.MAGE:
                    this.hero = new Mage_1.Mage(this);
                    break;
                case Types_1.T.Heroes.ROGUE:
                    this.hero = new Rogue_1.Rogue(this);
                    break;
                default:
                    break;
            }
            this.hero.create();
            setTimeout(function () {
                console.log('back');
                _this.transition.change('HeroSelect');
            }, 1500);
            /*
            
            var points:Array<number> = [
                0, 0, // 1
                this.game.canvas.width, 0,  // 2
                this.game.canvas.width + (this.game.canvas.width / 2), this.game.canvas.height, // 4
                0, this.game.canvas.height // 3
            ]
    
            this.poly = this.add.polygon(0, 0, points, 0x0000FF);
            this.poly.setOrigin(0, 0);
            
    
    
            
    
            setTimeout(()=>{
                console.log('--?')
                this.poly.x = -this.poly.width;
            }, 1500)
            */
        };
        GameScene.prototype.update = function () {
            // this.poly.x -= 0.5;
        };
        return GameScene;
    }(PKScene_4.PkScene));
    exports.GameScene = GameScene;
});
define("game/scenes/HeroSelect", ["require", "exports", "pkframe/scene/PKScene", "game/elements/Characters/Heroes/Knight", "game/elements/Characters/Heroes/Mage", "game/elements/Characters/Heroes/Rogue", "game/elements/Text/MiniPhrase", "pkframe/utils/PkUtils", "game/Types", "pkframe/scene/transitions/Slide"], function (require, exports, PKScene_5, Knight_3, Mage_2, Rogue_2, MiniPhrase_2, PkUtils_4, Types_2, Slide_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HeroSelect = /** @class */ (function (_super) {
        __extends(HeroSelect, _super);
        function HeroSelect() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.wallCollumns = new Array();
            _this.timeouts = new Array();
            return _this;
        }
        HeroSelect.prototype.init = function () {
            _super.prototype.init.call(this);
            this.transition.transitionAnimation = new Slide_3.PkTransitionSlide(this);
        };
        HeroSelect.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);
            console.log('- hero select creating layers');
            this.addLayer('scene-bg');
            this.addLayer('characters');
            this.addLayer('scene-front');
            this.addLayer('scene-front-front'); // kek
            // walls
            this.wallMiddleTile = this.add.tileSprite(0, 0, this.game.canvas.width, this.game.canvas.height, 'wall-middle');
            this.wallBottomMiddleTile = this.add.tileSprite(0, -12, this.game.canvas.width, 16, 'wall-top-middle');
            this.wallMiddleTile.setOrigin(0, 0);
            this.wallBottomMiddleTile.setOrigin(0, 0);
            // waiting text
            var blinkTime = 300;
            this.chooseYourHero = MiniPhrase_2.MiniPhrase.build(this, [
                { text: 'CHOOSE', duration: blinkTime },
                { text: 'YOUR', duration: blinkTime },
                { text: 'HERO', duration: blinkTime + 100 },
            ]);
            this.chooseYourHero.create();
            this.addToLayer('scene-front-front', this.chooseYourHero);
            this.wallMiddleTile.alpha = 0.7;
            this.addToLayer('scene-bg', this.wallMiddleTile);
            // heores
            this.knight = new Knight_3.Knight(this);
            this.knight.create();
            this.knight.spriteBase.originX = 0.5;
            this.knight.x += 17;
            this.knight.y += 200;
            this.mage = new Mage_2.Mage(this);
            this.mage.create();
            this.mage.spriteBase.originX = 0.5;
            this.mage.x += 40;
            this.mage.y += 200;
            this.rogue = new Rogue_2.Rogue(this);
            this.rogue.create();
            this.rogue.spriteBase.originX = 0.5;
            this.rogue.x += 63;
            this.rogue.y += 200;
            this.addToLayer('scene-bg', this.knight);
            this.addToLayer('scene-bg', this.mage);
            this.addToLayer('scene-bg', this.rogue);
            // click area
            this.knightClickArea = PkUtils_4.PkUtils.createSquare(this, this.game.canvas.width / 3, this.game.canvas.height, 0xFF0000);
            this.knightClickArea.alpha = 0.01;
            this.mageClickArea = PkUtils_4.PkUtils.createSquare(this, this.game.canvas.width / 3, this.game.canvas.height, 0x0000FF);
            this.mageClickArea.x = this.game.canvas.width / 3;
            this.mageClickArea.alpha = 0.01;
            this.rogueClickArea = PkUtils_4.PkUtils.createSquare(this, this.game.canvas.width / 3, this.game.canvas.height, 0x00FF00);
            this.rogueClickArea.x = (this.game.canvas.width / 3) * 2;
            this.rogueClickArea.alpha = 0.01;
            this.knightClickArea.setInteractive({ useHandCursor: true });
            this.knightClickArea.on('pointerup', function (pointer) {
                _this.transition.change('GameScene', Types_2.T.Heroes.KNIGHT);
            });
            this.mageClickArea.setInteractive({ useHandCursor: true });
            this.mageClickArea.on('pointerup', function (pointer) {
                _this.transition.change('GameScene', Types_2.T.Heroes.MAGE);
            });
            this.rogueClickArea.setInteractive({ useHandCursor: true });
            this.rogueClickArea.on('pointerup', function (pointer) {
                _this.transition.change('GameScene', Types_2.T.Heroes.ROGUE);
            });
            this.heroesIntro();
        };
        HeroSelect.prototype.heroesIntro = function () {
            var _this = this;
            // jump drop
            this.tweens.add({
                targets: [this.knight, this.mage, this.rogue],
                y: -3,
                // yoyo: true,
                duration: 500,
                ease: 'Back.easeOut',
                // repeat: -1,
                delay: function (i, total, target) {
                    return i * 350;
                },
                onComplete: function () {
                    _this.timeouts.push(setTimeout(function () {
                        _this.waiting();
                    }, 500));
                    _this.knight.idle();
                    _this.mage.idle();
                    _this.rogue.idle();
                }
            });
            // squeeze
            this.tweens.add({
                targets: [this.knight, this.mage, this.rogue],
                scaleX: .5,
                yoyo: true,
                duration: 250,
                ease: 'Bounce.easeOut',
                delay: function (i, total, target) {
                    return i * 175;
                }
            });
        };
        HeroSelect.prototype.waiting = function () {
            var _this = this;
            this.timeouts.push(setInterval(function () {
                _this.chooseYourHero.play();
            }, 5100));
            this.chooseYourHero.play();
        };
        HeroSelect.prototype.shutdown = function () {
            console.log('-- hero select out --');
            // clear intervals
            for (var i in this.timeouts)
                clearInterval(this.timeouts[i]);
            //
        };
        return HeroSelect;
    }(PKScene_5.PkScene));
    exports.HeroSelect = HeroSelect;
});
define("game/scenes/Intro", ["require", "exports", "pkframe/scene/PKScene", "game/elements/Text/MiniPhrase", "pkframe/scene/transitions/Slide"], function (require, exports, PKScene_6, MiniPhrase_3, Slide_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IntroScene = /** @class */ (function (_super) {
        __extends(IntroScene, _super);
        function IntroScene() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        IntroScene.prototype.init = function () {
            _super.prototype.init.call(this);
            this.transition.transitionAnimation = new Slide_4.PkTransitionSlide(this);
        };
        IntroScene.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);
            console.log('INTRO SCENE');
            var mp = MiniPhrase_3.MiniPhrase.build(this, [
                { text: 'WEALCOME', duration: 850 },
                { text: 'TO', duration: 450 },
                { text: 'DICK', duration: 800 },
                { text: 'SIZE', duration: 800 },
            ]);
            mp.event.add(MiniPhrase_3.E.OnPhaseEnd, function () {
                var mp = MiniPhrase_3.MiniPhrase.build(_this, [
                    { text: 'DUNGEON', duration: 800 },
                    { text: '', duration: 300 },
                    { text: 'DUNGEON', duration: 350 },
                    { text: '', duration: 300 },
                    { text: 'DUNGEON', duration: 350 },
                ]);
                mp.play();
                mp.event.add(MiniPhrase_3.E.OnPhaseEnd, function () {
                    console.log('CHANGE TO MAIN');
                    _this.transition.change('Main');
                }, _this);
            }, this);
            mp.play();
        };
        return IntroScene;
    }(PKScene_6.PkScene));
    exports.IntroScene = IntroScene;
});
define("game/Game", ["require", "exports", "jquery", "pkframe/PkGame", "pkframe/PkConfig", "game/Loader", "game/scenes/Main", "game/scenes/GameScene", "game/scenes/HeroSelect", "game/scenes/Intro"], function (require, exports, $, PkGame_4, PkConfig_2, Loader_1, Main_1, GameScene_1, HeroSelect_1, Intro_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game() {
            var _this = _super.call(this, new Config()) || this;
            // add states
            _this.scene.add('Intro', Intro_1.IntroScene);
            _this.scene.add('Main', Main_1.Main);
            _this.scene.add('HeroSelect', HeroSelect_1.HeroSelect);
            _this.scene.add('GameScene', GameScene_1.GameScene);
            return _this;
        }
        return Game;
    }(PkGame_4.PkGame));
    exports.Game = Game;
    var Config = /** @class */ (function (_super) {
        __extends(Config, _super);
        function Config() {
            var _this = _super.call(this) || this;
            // loading load screen assets (logo, loading bar, etc) [pre-preloading]
            _this.preLoaderState = Loader_1.Preloader;
            // loading all* game assets
            _this.loaderState = Loader_1.Loader;
            _this.canvasSize = [80, 30];
            _this.initialState = 'Intro';
            return _this;
        }
        return Config;
    }(PkConfig_2.PkConfig));
    // inicia
    $(document).ready(function () {
        var game = new Game();
    });
});
define("pkframe/scene/PkLayer", ["require", "exports", "pkframe/element/PkElement"], function (require, exports, PkElement_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PkLayer = /** @class */ (function (_super) {
        __extends(PkLayer, _super);
        function PkLayer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.distance = 1; // use for parallax effect
            return _this;
        }
        return PkLayer;
    }(PkElement_5.PkElement));
    exports.PkLayer = PkLayer;
});
define("pkframe/scene/PkParallax", ["require", "exports", "pkframe/scene/PkLayer"], function (require, exports, PkLayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PkParallax = /** @class */ (function () {
        function PkParallax(scene) {
            this.layers = [];
            this.scene = scene;
        }
        PkParallax.prototype.add = function (element, distance, cameraLock) {
            if (cameraLock === void 0) { cameraLock = true; }
            // if using TileSprite, distance is mandatary
            if (element instanceof Phaser.GameObjects.TileSprite && !distance)
                throw new Error("If you use TileSprite for parallax, distance param is mandatory");
            //
            if (element instanceof PkLayer_1.PkLayer && distance)
                element.distance = distance;
            //
            if (element instanceof PkLayer_1.PkLayer && distance)
                element.distance = distance;
            //
            /*
            if(element instanceof Phaser.GameObjects.TileSprite && cameraLock)
                element.fixedToCamera = true;
            // */
            this.layers.push({
                tileElement: element instanceof Phaser.GameObjects.TileSprite ? element : null,
                layerElement: element instanceof PkLayer_1.PkLayer ? element : null,
                distance: element instanceof PkLayer_1.PkLayer ? element.distance : distance
            });
        };
        PkParallax.prototype.update = function () {
            for (var i in this.layers) {
                // if is tile sprite element
                if (this.layers[i].tileElement) {
                    var posX = 1 / this.layers[i].distance;
                    this.layers[i].tileElement.tilePositionX = -this.scene.cameras[0].posX * posX;
                    this.layers[i].tileElement.tilePositionY = -this.scene.cameras[0].posY * posX;
                }
                // if is layer
                if (this.layers[i].layerElement) {
                    // @todo
                }
            }
            ;
        };
        return PkParallax;
    }());
    exports.PkParallax = PkParallax;
});
define("pkframe/screen/PKScreen", ["require", "exports", "pkframe/element/PkElement", "pkframe/utils/PkUtils"], function (require, exports, PkElement_6, PkUtils_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PkScreen = /** @class */ (function (_super) {
        __extends(PkScreen, _super);
        function PkScreen(game) {
            var _this = _super.call(this, game) || this;
            _this.bgAlpha = 0.75;
            _this.blockOverInput = true;
            return _this;
        }
        PkScreen.prototype.create = function () {
            this.createBg();
        };
        PkScreen.prototype.createBg = function () {
            // create a generic background 
            this.bg = PkUtils_5.PkUtils.createSquare(this.scene, this.scene.game.canvas.width, this.scene.game.canvas.height, 0x000000);
            this.bg.alpha = this.bgAlpha;
            if (this.blockOverInput) {
                this.bg.input.enabled = true;
                // this.bg.input.priorityID = Number.POSITIVE_INFINITY;
            }
            this.add(this.bg);
            this.close();
        };
        PkScreen.prototype.open = function () {
            this.visible = true;
        };
        PkScreen.prototype.close = function () {
            this.visible = false;
        };
        return PkScreen;
    }(PkElement_6.PkElement));
    exports.PkScreen = PkScreen;
});
//# sourceMappingURL=build.js.map