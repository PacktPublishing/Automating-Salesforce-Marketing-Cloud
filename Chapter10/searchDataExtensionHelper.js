({
  getSearchResults: function(component, event, helper) {
    var action = component.get("c.searchDataExtension");
    var searchId = component.get("v.searchId");
    action.setParams({ SearchParam: searchId });
    action.setCallback(this, function(response) {
      var temp = response.getReturnValue();
      var json = JSON.parse(temp.toString());
      var primNode = json.items;
      var resultsArr = [];
      for (var i in primNode) {
        var arrVals = primNode[i].values;
        resultsArr.push(arrVals);
      }
      component.set("v.searchResults", resultsArr);
    });
    $A.enqueueAction(action);
  }
});