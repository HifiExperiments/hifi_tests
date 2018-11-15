if (typeof PATH_TO_THE_REPO_PATH_UTILS_FILE === 'undefined') PATH_TO_THE_REPO_PATH_UTILS_FILE = "https://raw.githubusercontent.com/highfidelity/hifi_tests/master/tests/utils/branchUtils.js";
Script.include(PATH_TO_THE_REPO_PATH_UTILS_FILE);
var nitpick = createNitpick(Script.resolvePath("."));

nitpick.perform("LOD test", Script.resolvePath("."), "secondary", function(testType) {
    var createdOverlays = [];

    var LIFETIME = 120;
    var DIM = {x: 1.0, y: 1.2, z: 0.28};

    MyAvatar.orientation = Quat.fromPitchYawRollDegrees(0.0, 0.0, 0.0);
    
    var pos = nitpick.getOriginFrame();
    var ori = MyAvatar.orientation;

    validationCamera_setRotation({ x: 0.0, y: 0.0, z: 0.0 });
    validationCamera_setTranslation({ x: 0.0, y: 0.0, z: 0.0 });
    
    // Create line of models
    var assetsRootPath = nitpick.getAssetsRootPath();
    var URL = Script.resolvePath(assetsRootPath + "models/geometry/avatars/kaya/Kaya.fbx");
    createdOverlays.push(Overlays.addOverlay("model", {
        position: Vec3.sum(Vec3.sum(Vec3.sum(pos, Vec3.multiply(1.6, Quat.getUp(ori))), Vec3.multiply(-0.5, Quat.getRight(ori))), Vec3.multiply(2.8, Quat.getForward(ori))),
        lifetime: LIFETIME,
        url: URL,
        dimensions: DIM,
        orientation: ori,
        isGroupCulled: false,
        isVisibleInSecondaryCamera: true
    }));

    createdOverlays.push(Overlays.addOverlay("model", {
        position: Vec3.sum(Vec3.sum(Vec3.sum(pos, Vec3.multiply(1.6, Quat.getUp(ori))), Vec3.multiply(0.5, Quat.getRight(ori))), Vec3.multiply(2.8, Quat.getForward(ori))),
        lifetime: LIFETIME,
        url: URL,
        dimensions: DIM,
        orientation: ori,
        isGroupCulled: true,
        isVisibleInSecondaryCamera: true
    }));
    
    LODManager.setAutomaticLODAdjust(false);
    LODManager.setOctreeSizeScale(32768 * 400);

    nitpick.addStepSnapshot("Both models visible");

    nitpick.addStep("Set LOD to 60", function () {
        LODManager.setOctreeSizeScale(32768 * 60);
    });
    nitpick.addStepSnapshot("Eyes of left model cannot be seen");

    nitpick.addStep("Set LOD to 10", function () {
        LODManager.setOctreeSizeScale(32768 * 10);
    });
    nitpick.addStepSnapshot("Only right model visible, including eyes");


    nitpick.addStep("Set LOD to 4", function () {
        LODManager.setOctreeSizeScale(32768 * 4);
    });
    nitpick.addStepSnapshot("No models are visible");

    nitpick.addStep("Clean up", function () {
        for (var i = 0; i < createdOverlays.length; i++) {
            Overlays.deleteOverlay(createdOverlays[i]);
        }

        LODManager.setOctreeSizeScale(32768 * 400);
        LODManager.setAutomaticLODAdjust(true);
    });

    nitpick.runTest(testType);
});