
// GLOBAL VARS

var _PlayerVersion = 'v0.06.0';

var AplicationManager = new AplicationManager();
var MenuFunctionsManager = new MenuFunctionsManager();

var _moData = new THREE.MediaObjectData();

var menuMgr = new MenuManager();
var settingsMgr = new SettingsManager();

var MenuDictionary = new MenuDictionary();

var _ManifestParser = new ManifestParser();

var _AudioManager = new AudioManager();
var interController = new THREE.InteractionsController();
var polyfill = new WebVRPolyfill();
var statObj = new StatObject();

var VideoController = new VideoController();
var _ImAc = new ImAcController();

var loggerActivated = true;

var sessionId = Date.now();

var demoId = 1;

var mainContentURL;
var list_contents;

var startupDelay = -1;
var startClickTime = 0;
var firtPlay = false;


/**
 * Initializes the web player.
 */	

function init_webplayer() 
{
	console.log('Version: ' + _PlayerVersion);

    startupDelay = 0;
    startClickTime = Date.now();
    firtPlay = false;

    var myhash = window.location.hash.split('#');

    _AudioManager.initAmbisonicResources();

    _moData.setFont('./css/fonts/TiresiasScreenfont_Regular.json').then(() => { 

        $.getJSON('../content.json', function(json)
        {
            list_contents = json.contents;

            //if ( myhash && myhash[1] && myhash[1] < list_contents.length && list_contents[ myhash[1] ] && localStorage.ImAc_init == myhash[1] ) 
           // {
                localStorage.removeItem('ImAc_init');
                localStorage.ImAc_language ? MenuDictionary.setMainLanguage( localStorage.ImAc_language ) : MenuDictionary.setMainLanguage( 'en' );

                mainContentURL = list_contents[ myhash[1] ].url;

                demoId = myhash[1];

                AplicationManager.init();

            //}
            //else window.location = window.location.origin + window.location.pathname.slice(0, -7);       
        });
    });
}

$(window).on('hashchange', function() 
{
    window.location.reload();
});