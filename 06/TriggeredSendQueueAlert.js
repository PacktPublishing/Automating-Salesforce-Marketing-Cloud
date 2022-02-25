<script runat=server> 
Platform.Load("Core","1.1.1"); 
 
// Global variables  
var prox = new Script.Util.WSProxy(); 
 
var mid = 123456; 
var failures = 0; 
var allTriggers = 1; // All triggers in BU, or false (0) if want specific filters only 
 
var alertArray = [] 
 
if (allTriggers) { 
 
  var tsdArray = getTSDKeys(mid); 
  var length = tsdArray.Results.length; 
 
} else { 
 
  var tsdArray = ["TriggerA","TriggerB","TriggerC","TriggerD","TriggerE"] // External Keys of the Triggers you want to check. 
 
  var length = tsdArray.length; 
 
  var maxQueueArray = [500,500,500,500,500]; // Enter max queue here. Can make an array as well, if different maxes per TSD 
 
} 
 
if (!maxQueueArray || maxQueueArray.length == 0) { 
 
  var maxQueueDefault = 500; // Default for if not using maxQueueArray 
 
} 
 
for (i=0; i < length; i++) { 
 
    if(allTriggers) { 
 
      var customerKey = tsdArray.Results[i].CustomerKey 
 
    } else { 
 
      var customerKey = tsdArray[i] 
 
    } 
 
    var queued = getTSDQueue(customerKey); 
 
    var queueArrLength = maxQueueArray.length;  
 
    // changes maxQueue to array value if exist and equal to i 
    if (maxQueueArray.length > 0 && maxQueueArray.length <= i) { 
 
      var maxQueue = maxQueueArray[i]; 
 
    } else { 
 
      var maxQueue = maxQueueDefault; 
 
    } 
 
    if (queued > maxQueue) { 
 
      //creates the failure object 
      var obj = {} 
      obj.customerkey = customerKey; 
      obj.queue = queued; 
 
      //pushes the failure obj to array 
      alertArray.push(obj) 
      failures += 1 //increases failure count 
 
    } 
 
} 
 
if (failures > 0) { 
 
  // Upserts into log DE 
  var rows = Platform.Function.UpsertData("myQueryQueue_LogDE", ["MID","TimeStamp"], [mid,getDate()], ["QueueAlertArrayStr"], [Stringify(alertArray)]) 
 
} 
 
 
/************************* FUNCTION LIST ************************/ 
 
function getTSDKeys(mid) { 
 
  /* Set ClientID */ 
  if (mid) { 
 
    prox.setClientId({ "ID": mid }); //Impersonates the BU 
 
  } 
 
  var cols = ["CustomerKey", "TriggeredSendStatus"]; 
  var res = prox.retrieve("TriggeredSendDefinition", cols, filter); 
 
  return res; 
 
} 
 
 
function getTSDQueue(customerKey) { 
 
  /* Set ClientID */ 
  if (mid) { 
 
    prox.setClientId({ "ID": mid }); //Impersonates the BU 
 
  } 
 
  var cols = ["CustomerKey","Queued"]; 
  var filter = { 
      Property: "CustomerKey", 
      SimpleOperator: "Equals", 
      Value: customerKey 
  }; 
 
  var res = prox.retrieve("TriggeredSendSummary", cols, filter); 
 
  var queue = res.Results[0].Queued 
 
  return queue; 
 
} 
 
</script> 
