if (typeof user === 'undefined') user = "highfidelity/";
if (typeof repository === 'undefined') repository = "hifi_tests/";
if (typeof branch === 'undefined') branch = "master/";

var autoTester = Script.require("https://github.com/" + user + repository + "blob/" + branch + "tests/utils/autoTester.js?raw=true" );

autoTester.perform("Haze - low range", Script.resolvePath("."), "secondary", function(testType) {
    // Test material matrix
    Script.include("../setup.js?raw=true")

    var HAZE = {
        hazeRange: 500.0,
        hazeBaseRef: MyAvatar.position.y
    };

    // Setup
    var createdEntities;
    autoTester.addStep("Setup", function () {
        createdEntities = setup(HAZE, autoTester.getOriginFrame());
    });

    autoTester.addStepSnapshot("Haze with low range - 500 mt");

    autoTester.addStep("Clean up after test", function () {
        for (var i = 0; i < createdEntities.length; i++) {
            Entities.deleteEntity(createdEntities[i]);
        }
    });

    var result = autoTester.runTest(testType);
});
