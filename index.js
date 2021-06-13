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
const HEADING_TEXT = '💰 LUNCH MONEY UPDATES 💰';


const LM_ACCESS_TOKEN = '';
const BASE_URL = 'https://dev.lunchmoney.app';

/****************************************************
             SETUP
*****************************************************/

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
  const line = headingStack.addText(HEADING_TEXT);
  headingStack.addSpacer();
  line.font = regularFont;
  line.textColor = Color.white();
  line.centerAlignText();
  
  const data = await getAllData();
  console.log(data)

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
