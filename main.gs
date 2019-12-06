var SLACK_INCOMING_WEBHOOK_URL = '';

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
  } else if (command == "help") {
    message = "*[echo {args}]* : 入力された文字列をそのまま返す";
  } else {
    message = command + "command not found.";
  }
  
  notifyToSlack(message);
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
  runMainProcess("@ykkcbot hoge");
}