var SLACK_INCOMING_WEBHOOK_URL = '';
var SPREAD_SHEET_ID = '';

function doPost(e) {
  var inputString = e.parameter.text;
  runMainProcess(inputString);
}

function runMainProcess(args) {
  if (!checkProcessVaridation(args)) {
    return;
  }
  runCommand(args);
}

function runCommand(inputString) {
  var inputArray = inputString.split(" ");
  var command = inputArray[1];
  var message = "";
  
  if (command == "echo") {
    if (inputArray.length > 2) {
      message = inputString.slice(parseInt(command.length, 10) + 1 + 9);
    }
    
  } else if (command == "lunch") {
    var spreadsheet = SpreadsheetApp.openById(SPREAD_SHEET_ID);
    var sheet = spreadsheet.getSheetByName('lunch_list');
    var lastRow = sheet.getLastRow();
    var loopCount = 1;
    
    if (inputArray.length > 2) {
      var inputCount = parseInt(inputArray[2]);
      if (isNaN_(inputCount)) {
        if (inputCount > 10) {
          loopCount = 10;
        } else {
          loopCount = inputCount;
        }
      }
    }
    
    for (i=1;i<=loopCount;i++) {
      var targetStoreId = Math.floor(Math.random()*lastRow);
      if (targetStoreId < lastRow - 1) { targetStoreId = targetStoreId + 2; }
      var storeName = sheet.getRange(targetStoreId, 1).getValue();
      var storeUrl = sheet.getRange(targetStoreId, 2).getValue();
      message += "*"+storeName+"* : "+storeUrl+"\n";
    }
    
  } else if (command == "help") {
    message 
    = "*[echo {args}]* : 入力された文字列をそのまま返す\n"
    + "*[lunch]* : リストからランダムに1店舗返す\n"
    + "*[lunch {int value}]* : リストからランダムに指定された数の店舗を返す(最大10件まで)";
    
  } else {
    message = command + " command not found.";
    
  }
  
  Logger.log(message);
  // notifyToSlack(message);
}

function isNaN_(value) {
  var stringValue = String(value);
  return typeof value === 'number' && stringValue != "NaN";
}

function checkProcessVaridation(message) {
  var inputArray = message.split(" ");
  
  if (inputArray.length < 2) {
    // ["@ykkcbot", "{command}"] が最低限担保されていること
    return false;
  }
  
  if (inputArray[0] != "@ykkcbot") {
    // 入力の第一文字列がbotでなければ中断する
    return false;
  }
  
  return true;
}

function notifyToSlack(message) {
  var jsonData =
      {
        "text" : message
      };
  
  var options =
      {
        "method" : "post",
        "contentType" : "application/json",
        "payload" : JSON.stringify(jsonData)
      };
  
  UrlFetchApp.fetch(SLACK_INCOMING_WEBHOOK_URL, options);
}

function test() {
  runMainProcess("@ykkcbot lunch");
}