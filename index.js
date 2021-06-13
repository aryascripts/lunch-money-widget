/****************************************************
             CONFIGURATION
*****************************************************/
const COLORS = {
  bg1: '#1D1F21',
  bg2: '#282A2E'
};
const FONT_NAME = 'Menlo';
const FONT_SIZE = 12;
const regularFont = new Font(FONT_NAME, FONT_SIZE);

const BASE_URL = 'https://dev.lunchmoney.app';

const local = FileManager.local();
const iCloud = FileManager.iCloud();

const BASE_FILE = 'LunchMoneyWidget';
const API_FILE = "apiKey";

const ICLOUD = "iCloud";
const LOCAL = "local";
/****************************************************
             SETUP
*****************************************************/

const LM_ACCESS_TOKEN = await getApiKey();
const widget = await getWidget();

Script.setWidget(widget);
Script.complete();

/****************************************************
             WIDGET
*****************************************************/

async function getWidget() {
  const widget = new ListWidget();
  const gradient = getLinearGradient(COLORS.bg1, COLORS.bg2);
  widget.backgroundGradient = gradient;
  widget.setPadding(10, 18, 10, 18);
  
  const mainStack = widget.addStack();
  mainStack.layoutVertically();
  mainStack.spacing = 2;
  mainStack.size = new Size(320, 0);
  
  
  const headingStack = mainStack.addStack();
  headingStack.layoutHorizontally();
  headingStack.addSpacer();
  const line = headingStack.addText('💰 LUNCH MONEY UPDATES 💰');
  headingStack.addSpacer();
  line.font = regularFont;
  line.textColor = Color.white();
  line.centerAlignText();
  
  const data = await getAllData();

  const line2 = mainStack.addText(`⏳Awaiting Review: ${data.pendingTransactions}`);
  line2.font = regularFont;
  line2.textColor = Color.white();
  
  const line3 = mainStack.addText('Test3');
  line3.font = regularFont;
  line3.textColor = Color.white();
  
  mainStack.addSpacer();
  return widget;
};


async function getAllData() {
  const pendingTransactions = await lunchMoneyGetPendingTransactions();

  return {
    pendingTransactions
  };
}

/****************************************************
             UI FUNCTIONS
*****************************************************/

function getLinearGradient(color1, color2) {  
  const gradient = new LinearGradient();       
  gradient.colors = [new Color(color1), new Color(color2)];
  gradient.locations = [0.0, 1.0];
  return gradient;
};


/****************************************************
            API
*****************************************************/


async function lunchMoneyGetPendingTransactions() {
  const url = `${BASE_URL}/v1/transactions`;
  const params = {
    limit: 50,
    status: "uncleared"
  };
  try {
    const res = await makeLunchMoneyRequest(url, params);
    return res.transactions.length;
  } catch (e) {
    return "?";
  }
}

function makeLunchMoneyRequest(url, params) {
  const headers = {
    'Authorization': `Bearer ${LM_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  };
  return makeRequest(url, params, headers);
}

function makeRequest(url, params, headers, method = 'GET') {
  let query = ``;
  Object.keys(params).forEach((key, i) => {
    const value = params[key];
    query += i === 0 ? '?' : '&';
    query += `${key}=${value}`;
  });
  const req = new Request(url + query);
  req.headers = headers;
  req.method = method;
  
  return req.loadJSON();
}

/****************************************************
            File Management
*****************************************************/

async function getApiKey() {
  const keyLocation = BASE_FILE + "/" + API_FILE;
  const exists = doesFileExist(keyLocation);
  if (exists) {
    return readString(keyLocation, exists);
  }
  const alert = new Alert();
  alert.addSecureTextField("api_key", "");
  alert.addAction("Device");
  alert.addAction("iCloud");
  alert.title = "Lunch Money API Key";
  alert.message = "Please enter your lunch money API key, found at https://my.lunchmoney.app/developers. Where do you want to save this information?";

  const option = await alert.present();
  const apiKey = alert.textFieldValue(0);
  
  saveToFile(apiKey, API_FILE, option === 0 ? "Device" : "iCloud");

  return apiKey;
}

function saveToFile(content, key, storage = "iCloud") {
    const folder = iCloud.documentsDirectory() + "/LunchMoneyWidget";
    const filePath = folder + `/${key}`;
    
    if (storage === "iCloud") {
      iCloud.createDirectory(folder, true);
      iCloud.writeString(filePath, content);
    }
    else {
      local.createDirectory(folder, true);
      local.writeString(filePath, content)
    }
}

function readString(filePath, storage) {
  if (storage === ICLOUD) { 
    return iCloud.readString(iCloud.documentsDirectory() + "/" + filePath);
  }
  else {
    return local.readString(local.documentsDirectory() + "/" + filePath);
  }
}

function doesFileExist(filePath) {
  if (iCloud.fileExists(iCloud.documentsDirectory() +  "/" + filePath)) {
    return ICLOUD;
  }
  if (local.fileExists(local.documentsDirectory() + "/" + filePath)) {
    return LOCAL;
  }
  return false;
}
