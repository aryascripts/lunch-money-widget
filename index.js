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


/****************************************************
             SETUP
*****************************************************/


const widget = getWidget();

Script.setWidget(widget);
Script.complete();





/****************************************************
             WIDGET
*****************************************************/

function getWidget() {
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
  

  const line2 = mainStack.addText('Test2');
  line2.font = regularFont;
  line2.textColor = Color.white();
  
  const line3 = mainStack.addText('Test3');
  line3.font = regularFont;
  line3.textColor = Color.white();
  
  mainStack.addSpacer();
  return widget;
};






/****************************************************
             UI FUNCTIONS
*****************************************************/

function getLinearGradient(color1, color2) {  
  const gradient = new LinearGradient();       
  gradient.colors = [new Color(color1), new Color(color2)];
  gradient.locations = [0.0, 1.0]
  return gradient;
};
