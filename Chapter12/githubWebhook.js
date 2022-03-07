<script runat=server>
Platform.Load("core", "1.1.1");
try {
  var postData = Platform.Request.GetPostData();
  var json = Platform.Function.ParseJSON(postData);
    var rows = Platform.Function.InsertData("YOUR LOGGING DATA EXTENSION",["data"],[json]);
    var baseContentsURL = json.repository.contents_url;
    baseContentsURL = baseContentsURL.slice(0, baseContentsURL.lastIndexOf('/') + 1);
    var addedFilesInCommit = json.commits[0].added;
    var accessToken = "YOUR GITHUB ACCESS TOKEN";
    for (var i in addedFilesInCommit) {
        var assetPath = addedFilesInCommit[i];
        var categoryId = assetPath.substring(0, assetPath.indexOf("/"));
        var contentName =  assetPath.split("/").pop().replace(".html","");
        var contentData = getRawGithubData(accessToken, assetPath, baseContentsURL);
        createAsset(contentName, contentData, 220, categoryId);
        Write('{"status":"ok"}');
    }
} catch (e) {
    Write(Stringify(e));
}

function createAsset(assetName, assetContent, assetId, assetCategoryId) {
    var asset = Platform.Function.CreateObject("Asset");

    var nameIdReference = Platform.Function.CreateObject("nameIdReference");
    Platform.Function.SetObjectProperty(nameIdReference, "Id", assetId);
    Platform.Function.SetObjectProperty(asset, "AssetType", nameIdReference);

    var categoryNameIdReference = Platform.Function.CreateObject("categoryNameIdReference");
    Platform.Function.SetObjectProperty(categoryNameIdReference, "Id", assetCategoryId);
    Platform.Function.SetObjectProperty(asset, "Category", categoryNameIdReference);

    Platform.Function.SetObjectProperty(asset, "Name", assetName);
    Platform.Function.SetObjectProperty(asset, "Content", assetContent);
    Platform.Function.SetObjectProperty(asset, "ContentType", "application/json");


    var statusAndRequest = [0, 0];
    var response = Platform.Function.InvokeCreate(asset, statusAndRequest, null);
    return response;
}

function getRawGithubData(accessToken, assetPath, contentURL) {
    var auth = 'token ' + accessToken;
    var url = contentURL + assetPath;
    var req = new Script.Util.HttpRequest(url);
    req.emptyContentHandling = 0;
    req.retries = 2;
    req.continueOnError = true;
    req.contentType = "application/json"
    req.setHeader("Authorization", auth);
    req.setHeader("user-agent", "marketing-cloud");
    req.setHeader("Accept", "application/vnd.github.VERSION.raw");;
    req.method = "GET";
    var resp = req.send();
    var resultString = String(resp.content);
}
</script>