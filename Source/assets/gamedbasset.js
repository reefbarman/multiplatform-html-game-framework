include("assets/asset.js", true);
include("assets/assetmanager.js", true);

if (typeof Papa == "undefined" || typeof Papa.parse == "undefined")
{
    throw new ReferenceError('PapaParse lib has not been include please add this line to your index: <script type="text/javascript" src="engine/Source/lib/papaparse/papaparse-3.1.3.min.js"></script>');
}

function GameDbAsset(sFileName, cOptions)
{
    this._Asset(sFileName);

    var cDefaults = {};

    this.m_cOptions = extend(cDefaults, isset(cOptions) ? cOptions : {});

    this.m_bLoaded = false;

    this.m_cGameDB = {};
}

inherits(GameDbAsset, EN.Asset);

Object.defineProperty(GameDbAsset.prototype, "GameDB", {
    get: function(){
        return this.m_cGameDB;
    }
});

GameDbAsset.prototype.Load = function(fOnLoad){
    var self = this;

    EN.AssetManager.LoadFile("dbs/" + this.m_sFileName + ".csv", function(cErr, sContents){
        if (cErr)
        {
            fOnLoad(cErr);
        }
        else
        {
            var cLastError = null;

            //Parse CSV format
            Papa.parse(sContents, {
                header: true,
                dynamicTyping: true,
                worker: true,
                step: function(cRow){
                    if (cRow.errors && cRow.errors.length > 0)
                    {
                        cLastError = cRow.errors[cRow.errors.length - 1];
                    }

                    if (cRow.data && isset(cRow.data[0].Keys))
                    {
                        var sKey = cRow.data[0].Keys;
                        delete cRow.data[0].Keys;

                        self.m_cGameDB[sKey] = cRow.data[0];
                    }
                    else
                    {
                        cLastError = new Error("Missing Keys field in csv data");
                    }
                },
                complete: function(){
                    if (cLastError)
                    {
                        this.m_cGameDB = {};
                        fOnLoad(cLastError);
                    }
                    else
                    {
                        this.m_bLoaded = true;

                        fOnLoad.apply(self);
                    }
                }
            });
        }
    });
};

GameDbAsset.prototype.CleanUp = function(){
    this._CleanUp_Asset();
    EN.AssetManager.ReleaseFile("dbs/" + this.m_sFileName + ".csv");

    this.m_cGameDB = {};
};

EN.GameDbAsset = GameDbAsset;
//# sourceURL=engine/assets/gamedbasset.js