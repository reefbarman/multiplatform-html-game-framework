//ECMAScript6

include("assets/asset.js", true);
include("assets/imageasset.js", true);

class SpriteSheetAsset extends EN.Asset
{
    //////////////////////////////////////////////////////////
    //region Constructor
    constructor(sFileName)
    {
        super(sFileName);

        this.m_sDescriptorFile = "images/" + sFileName + ".json";
        this.m_sSpriteFile =  sFileName + ".png";

        this.m_cDescriptor = null;
        this.m_cImage = null;

        this.m_cImageAssets = {};

        this.Loaded = false;
    }

    //endregion

    //////////////////////////////////////////////////////////
    //region Public Method

    Load(fOnLoad)
    {
        var self = this;

        EN.AssetManager.LoadFile(this.m_sDescriptorFile, function(cErr, sSpriteSheetDescription){
            if (!cErr)
            {
                self.m_cDescriptor = JSON.parse(sSpriteSheetDescription);

                if (self.m_cDescriptor.frames)
                {
                    EN.AssetManager.LoadImage(self.m_sSpriteFile, function(cErr, cImage){
                        if (!cErr)
                        {
                            self.m_cImage = cImage;

                            for (var sKey in self.m_cDescriptor.frames)
                            {
                                var cFrame = self.m_cDescriptor.frames[sKey];

                                self.m_cImageAssets[sKey] = new EN.ImageAsset(sKey, {
                                    visibleWidth: cFrame.frame.w,
                                    visibleHeight: cFrame.frame.h,
                                    offset: {
                                        x: cFrame.frame.x,
                                        y: cFrame.frame.y
                                    },
                                    baseImage: self.m_cImage
                                });
                            }

                            self.Loaded = true;

                            fOnLoad();
                        }
                        else
                        {
                            throw cErr;
                        }
                    });
                }
                else
                {
                    throw new Error("Texture Packer Descriptor Format Wrong!");
                }
            }
            else
            {
                fOnLoad();
            }
        });
    }

    GetImage(sImageName)
    {
        return this.m_cImageAssets[sImageName];
    }

    CleanUp()
    {
        super.CleanUp();
        EN.AssetManager.ReleaseFile(this.m_sDescriptorFile);
        EN.AssetManager.ReleaseImage(this.m_sSpriteFile);
    }

    //endregion
}

EN.SpriteSheetAsset = SpriteSheetAsset;
