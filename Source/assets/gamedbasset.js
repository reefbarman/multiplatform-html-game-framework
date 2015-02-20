//ECMAScript6

include("assets/asset.js", true);
include("assets/assetmanager.js", true);
include("lib/papaparse/papaparse-3.1.3.min.js", true);

class GameDbAsset extends EN.Asset
{
    constructor(sFileName, cOptions)
    {
        super(sFileName);

        var cDefaults = {};

        this.m_cOptions = extend(cDefaults, isset(cOptions) ? cOptions : {});

        this.m_bLoaded = false;

        this.m_cGameDB = {};
    }

    get GameDB()
    {
        return this.m_cGameDB;
    }

    Load(fOnLoad)
    {
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
    }

    CleanUp()
    {
        super.CleanUp();

        EN.AssetManager.ReleaseFile("dbs/" + this.m_sFileName + ".csv");
        this.m_cGameDB = {};
    }
}

EN.GameDbAsset = GameDbAsset;
