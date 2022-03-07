@AuraEnabled
public static String getMarketingCloudToken(){
    String responseBody = makeJSONPostCall(
        MARKETING_CLOUD_AUTH_URL,
        JSON.serialize( new Map<String, String>{
            "grant_type': 'client_credentials'
                "clientId' => ClientID,
                "clientSecret' => ClientSecret
                "account_id': YOURMID
                } ), NULL
    );
    return ((Map<String, String>) JSON.deserialize(
        responseBody, Map<String, String>.class))
        .get( ACCESS_TOKEN );
}
@AuraEnabled
public static String searchDataExtension(String Email) {
    String authToken = getMarketingCloudToken();
    Http h = new Http();
    HttpRequest webReq = new HttpRequest();
    webReq.setMethod('GET');
    webReq.setHeader('Authorization',
                     "Bearer "+ authToken);
    webReq.setEndpoint(searchDEURL);
    HttpResponse res = h.send(webReq);
    String response = res.getbody();
    return response;
}