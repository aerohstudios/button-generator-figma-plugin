figma.showUI(__html__, { themeColors: true })
figma.ui.resize(400, 525)

// // Get local color styles
const colorStyles = figma.getLocalPaintStyles();

// // Create dropdown options
const options = colorStyles.map((style) => {
  return {
    label: style.name,
    value: style.paints[0], // Assuming one paint
  };
});

// Send options to UI
figma.ui.postMessage({ type: 'setDropdownOptions', options });


let useCustomSize = false;
let useCustomFontSize = false;
let useButtonPadding = false;
figma.ui.onmessage = async (pluginMessage) => {
  const newPage = figma.createPage();
  figma.currentPage = newPage;
  useCustomSize = pluginMessage.useCustomSize;
  useCustomFontSize = pluginMessage.useCustomFontSize;
  useButtonPadding = pluginMessage.useButtonPadding;

  const mainFrame = figma.createFrame();
  mainFrame.name = 'Main Frame';
  let componentWidth;
  let componentHeight;
  if (useCustomSize) {
    componentWidth = 429 + (4 * pluginMessage.buttonWidth);
    componentHeight = (4 * pluginMessage.buttonHeight * 1.69) + 280;
  } else if(useButtonPadding){
    componentWidth = 429 + (4 * ((pluginMessage.horizontalPadding*2)+38)) ;
    componentHeight = (4 * ((pluginMessage.verticalPadding*2)+15) * 1.69) + 280;
  }
  else {
    componentWidth = 429 + (4 * 117);
    componentHeight = (4 * 80) + 280
  }
  let totalMainFrameWidth = componentWidth + (componentWidth * 1.3) + (componentWidth * 1.69 + 120);
  let totalMainFrameHeight = componentHeight + 145;

  mainFrame.resize(totalMainFrameWidth, totalMainFrameHeight + 568);

  const heading1 = figma.createText();
  (async () => {

    const fontName: FontName = { family: pluginMessage.fontStyle, style: 'Bold' };
    try {
      await figma.loadFontAsync(fontName);
      heading1.fontName = fontName;
      heading1.characters = 'Here you go...';
      heading1.fontSize = 32;
      heading1.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
      heading1.x = mainFrame.width / 2 - heading1.width / 2;
      heading1.y = 30;
      mainFrame.appendChild(heading1);
    } catch (error) {
      console.error('Error loading font:', error);
    }
  })();

  const heading2 = figma.createText();
  (async () => {

    const fontName: FontName = { family: pluginMessage.fontStyle, style: 'Bold' };

    try {
      await figma.loadFontAsync(fontName);

      heading2.fontName = fontName;
      heading2.characters = 'Button Design System';
      heading2.fontSize = 48;
      heading2.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
      heading2.x = mainFrame.width / 2 - heading2.width / 2;
      heading2.y = 80;
      mainFrame.appendChild(heading2);
    } catch (error) {
      console.error('Error loading font:', error);
    }
  })();

  const component1 = generateComponentSet(pluginMessage.primaryrgbValues, pluginMessage.secondaryrgbValues, pluginMessage.buttonRadius, pluginMessage.fontStyle, 'small', pluginMessage.buttonHeight, pluginMessage.buttonWidth, pluginMessage.buttonFontSize, pluginMessage.verticalPadding, pluginMessage.horizontalPadding);

  let distanceX;
  if (useCustomSize) {
    distanceX = pluginMessage.buttonWidth * 4 * 1.69 + 500;
  } else if(useButtonPadding){
    distanceX = ((pluginMessage.horizontalPadding*2)+38) * 4 * 1.69 + 500;
  } else {
    distanceX = 1131;
  }
  const distanceY = 0;

  const component2 = generateComponentSet(pluginMessage.primaryrgbValues, pluginMessage.secondaryrgbValues, pluginMessage.buttonRadius, pluginMessage.fontStyle, 'medium', pluginMessage.buttonHeight, pluginMessage.buttonWidth, pluginMessage.buttonFontSize, pluginMessage.verticalPadding, pluginMessage.horizontalPadding);
  component2.x = component1.x + component1.width + 200;
  component2.y = component1.y + distanceY;

  const component3 = generateComponentSet(pluginMessage.primaryrgbValues, pluginMessage.secondaryrgbValues, pluginMessage.buttonRadius, pluginMessage.fontStyle, 'large', pluginMessage.buttonHeight, pluginMessage.buttonWidth, pluginMessage.buttonFontSize, pluginMessage.verticalPadding, pluginMessage.horizontalPadding);
  component3.x = component2.x + component2.width + 200;
  component3.y = component2.y + distanceY;

  mainFrame.y = Math.min(heading1.y, heading2.y, component1.y, component2.y, component3.y) - 30;

  mainFrame.appendChild(heading1);
  mainFrame.appendChild(heading2);
  mainFrame.appendChild(component1);
  mainFrame.appendChild(component2);
  mainFrame.appendChild(component3);

  figma.currentPage.appendChild(mainFrame);

  const tipsAndInstructions = figma.createText();
  (async () => {
    const fontName: FontName = { family: pluginMessage.fontStyle, style: 'Regular' };

    try {
      await figma.loadFontAsync(fontName);

      tipsAndInstructions.fontName = fontName;
      tipsAndInstructions.characters = 'Tips and Instructions:\n\n- Save this to your design system files.\n- You can click and modify any individual button.\n- Buttons are already converted to components and you can see the button state/type/size properties under the Design Section on the right-hand side of Figma';
      tipsAndInstructions.fontSize = 20;
      tipsAndInstructions.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
      tipsAndInstructions.x = 80;
      tipsAndInstructions.y = mainFrame.height - 150;
      mainFrame.appendChild(tipsAndInstructions);
    } catch (error) {
      console.error('Error loading font:', error);
    }
  })();
  const buttonsComponent1 = component1.children
    .filter(node => node.type === "COMPONENT")
    .map(node => node as ComponentNode);
  const buttonsComponent2 = component2.children
    .filter(node => node.type === "COMPONENT")
    .map(node => node as ComponentNode);
  const buttonsComponent3 = component3.children
    .filter(node => node.type === "COMPONENT")
    .map(node => node as ComponentNode);
  const allButtons = [...buttonsComponent1, ...buttonsComponent2, ...buttonsComponent3];

  const buttonSet = figma.combineAsVariants(allButtons, figma.currentPage);
  buttonSet.name = 'Button Set';
  buttonSet.cornerRadius = 0;
  const totalWidth = component1.width + component2.width + component3.width;
  const totalHeight = component3.height + 568;

  figma.notify('Yayyy! the button Design System is ready, go on and start using it!');
}
function generateComponentSet(primaryColor: RGB, secondaryColor: RGB, buttonRadius: number, fontStyle: string, buttonSize: 'small' | 'medium' | 'large', customButtonHeight: number, customButtonWidth: number, customButtonFontSize: number, verticalPadding: number, horizontalPadding: number) {

  let buttonWidth: number, buttonHeight: number;
  if (useCustomSize) {
    switch (buttonSize) {
      case 'small':
        buttonWidth = Number(customButtonWidth);
        buttonHeight = Number(customButtonHeight);
        break;
      case 'medium':
        buttonWidth = Number(customButtonWidth) * 1.3;
        buttonHeight = Number(customButtonHeight) * 1.3;
        break;
      case 'large':
        buttonWidth = Number(customButtonWidth) * 1.69;
        buttonHeight = Number(customButtonHeight) * 1.69;
        break;
      default:
        buttonWidth = 181;
        buttonHeight = 60;
    }
  } else {
    switch (buttonSize) {
      case 'small':
        buttonWidth = 117; // *1.27
        buttonHeight = 40; // *1.2
        break;
      case 'medium':
        buttonWidth = 149; // *1.27
        buttonHeight = 48; // *1.2
        break;
      case 'large':
        buttonWidth = 200; // *1.34
        buttonHeight = 80;
        break;
      default:
        buttonWidth = 181;
        buttonHeight = 60;
    }
  }

  const componentSet = figma.createFrame();
  componentSet.name = `Button Component Set - ${buttonSize}`;
  componentSet.resize(429 + (4 * buttonWidth), (4 * buttonHeight) + 340);

  componentSet.y = 300;
  componentSet.x = 80;

  (async () => {
    const buttonSizeLabel = figma.createText();
    const fontName: FontName = { family: fontStyle, style: 'Bold' };

    try {
      await figma.loadFontAsync(fontName);

      buttonSizeLabel.fontName = fontName;
      buttonSizeLabel.characters = `${buttonSize.toUpperCase()} BUTTONS`;
      buttonSizeLabel.fontSize = 32;
      buttonSizeLabel.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
      componentSet.appendChild(buttonSizeLabel);
    } catch (error) {
      console.error('Error loading font:', error);
    }
  })();

  const buttonTypes = ['primary', 'secondary', 'text', 'elevated'];
  const buttonStates = ['enabled', 'hover', 'pressed', 'disabled'];
  buttonTypes.forEach((buttonType, typeIndex) => {

    (async () => {
      const buttonTypeLabel = figma.createText();
      const fontName: FontName = { family: fontStyle, style: 'Bold' };

      try {
        await figma.loadFontAsync(fontName);
        buttonTypeLabel.fontName = fontName;
        buttonTypeLabel.characters = buttonType.toUpperCase();
        buttonTypeLabel.fontSize = 20;
        buttonTypeLabel.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
        buttonTypeLabel.textAlignHorizontal = 'CENTER';
        let textWidth;
        if (buttonWidth > 128) {
          textWidth = buttonWidth;
        }
        else {
          textWidth = 128;
        }
        buttonTypeLabel.resize(textWidth, buttonTypeLabel.height);

        const xPosition = 120 + buttonTypes.indexOf(buttonType) * (103 + buttonWidth);
        const yPosition = 110;

        buttonTypeLabel.x = xPosition;
        buttonTypeLabel.y = yPosition;
        componentSet.appendChild(buttonTypeLabel);
      } catch (error) {
        console.error('Error loading font:', error);
      }
    })();

    buttonStates.forEach((buttonState, stateIndex) => {

      if (buttonType === 'primary') {
        (async () => {
          const buttonStateLabel = figma.createText();
          const fontName: FontName = { family: fontStyle, style: 'Bold' };

          try {
            await figma.loadFontAsync(fontName);
            buttonStateLabel.fontName = fontName;
            buttonStateLabel.characters = buttonState.toUpperCase();
            buttonStateLabel.fontSize = 20;
            buttonStateLabel.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
            buttonStateLabel.resize(buttonStateLabel.width, buttonHeight);
            buttonStateLabel.textAlignVertical = 'CENTER';

            const xPosition = 0 + typeIndex * 220;
            const yPosition = 160 + buttonStates.indexOf(buttonState) * (60 + buttonHeight);

            buttonStateLabel.x = xPosition;
            buttonStateLabel.y = yPosition;

            componentSet.appendChild(buttonStateLabel);
          } catch (error) {
            console.error('Error loading font:', error);
          }
        })();
      }

      const buttonText = buttonState === 'disabled' ? 'Disabled' : 'Click me';
      const button = createButton(primaryColor, secondaryColor, buttonRadius, fontStyle, buttonType, buttonState, buttonText, buttonWidth, buttonHeight, buttonSize, customButtonFontSize, useButtonPadding, verticalPadding, horizontalPadding);
      const xPosition = 120 + buttonTypes.indexOf(buttonType) * (103 + buttonWidth);
      const yPosition = 160 + buttonStates.indexOf(buttonState) * (60 + buttonHeight);

      button.x = xPosition;
      button.y = yPosition;

      componentSet.appendChild(button);
    });
  });
  figma.currentPage.appendChild(componentSet);
  return componentSet;
}

function createButton(primaryColor: RGB, secondaryColor: RGB, buttonRadius: number, fontStyle: string, buttonType: string, buttonState: string, buttonText: string, width: number, height: number, buttonSize: string, customButtonFontSize: number, useButtonPadding: boolean, verticalPadding: number, horizontalPadding: number) {
  const button = figma.createComponent();
  button.name = `Button Type = ${buttonType}, Button State = ${buttonState}, Button Size = ${buttonSize}`;
  button.layoutMode = "HORIZONTAL";
  button.primaryAxisAlignItems = "CENTER";
  button.counterAxisAlignItems = "CENTER";
  button.counterAxisSizingMode = "AUTO";
  if(useButtonPadding){
    button.paddingTop = Number(verticalPadding);
    button.paddingBottom = Number(verticalPadding);
    button.paddingLeft = Number(horizontalPadding);
    button.paddingRight = Number(horizontalPadding);
  } else {
    button.resize(width, height);
  }
  button.cornerRadius = Number(buttonRadius);

  switch (buttonType) {
    case 'primary':
      button.fills = [{ type: 'SOLID', color: primaryColor }];
      break;
    case 'secondary':
      button.strokes = [{ type: 'SOLID', color: primaryColor }];
      button.strokeWeight = 2;
      break;
    case 'text':
      button.fills = [];
      break;
    case 'elevated':
      button.fills = [{ type: 'SOLID', color: primaryColor }];
      button.effects = [{
        type: 'DROP_SHADOW',
        color: { r: 0, g: 0, b: 0, a: 0.25 },
        offset: { x: 0, y: 4 },
        radius: 4,
        visible: true,
        blendMode: 'NORMAL',
      }];
      break;
    default:
      break;
  }

  (async () => {
    const buttonTextNode = figma.createText();
    const fontName: FontName = { family: fontStyle, style: 'Regular' };

    try {
      await figma.loadFontAsync(fontName);
      buttonTextNode.fontName = fontName;
      buttonTextNode.characters = 'Button';
      if (useCustomFontSize) {
        buttonTextNode.fontSize = Number(customButtonFontSize);
      }
      else if (height === width && useCustomSize) {
        buttonTextNode.fontSize = Math.max(12, Math.floor(width / 20) * 4);
      } else {
        buttonTextNode.fontSize = Math.max(12, Math.floor(width / 20) * 4);
      }

      if (buttonType == 'primary' || buttonType == 'elevated') {
        buttonTextNode.fills = [{ type: 'SOLID', color: secondaryColor }];
      }
      else if (buttonType == 'secondary') {
        if (buttonState == 'pressed') {
          buttonTextNode.fills = [{ type: 'SOLID', color: secondaryColor }];
        }
        else if (buttonState == 'disabled') {
          buttonTextNode.fills = [{ type: 'SOLID', color: primaryColor, opacity: 0.32 }];
        }
        else {
          buttonTextNode.fills = [{ type: 'SOLID', color: primaryColor }];
        }
      }
      else if (buttonType == 'text') {
        if (buttonState == 'pressed') {
          buttonTextNode.fills = [{ type: 'SOLID', color: secondaryColor }];
        }
        else if (buttonState == 'disabled') {
          buttonTextNode.fills = [{ type: 'SOLID', color: primaryColor, opacity: 0.32 }];
        }
        else {
          buttonTextNode.fills = [{ type: 'SOLID', color: primaryColor }];
        }
      }
      else if (buttonType == 'elevated') {
        buttonTextNode.fills = [{ type: 'SOLID', color: primaryColor }];
      }
      button.appendChild(buttonTextNode);
    } catch (error) {
      console.error('Error loading font:', error);
    }
  })();

  if (buttonType == 'primary' || buttonType == 'elevated') {
    if (buttonState == 'hover') {
      button.fills = [{ type: 'SOLID', color: { r: Math.max(0, primaryColor.r - 0.1), g: Math.max(0, primaryColor.g - 0.1), b: Math.max(0, primaryColor.b - 0.1) } }];

    }
    else if (buttonState == 'pressed') {
      button.fills = [{ type: 'SOLID', color: { r: Math.max(0, primaryColor.r - 0.2), g: Math.max(0, primaryColor.g - 0.2), b: Math.max(0, primaryColor.b - 0.2) } }];
    }
    else if (buttonState == 'disabled') {
      button.fills = [{
        type: 'SOLID',
        color: primaryColor,
        opacity: 0.3
      }];
    }

  } else if (buttonType == 'text') {
    if (buttonState == 'hover') {
      button.fills = [{
        type: 'SOLID',
        color: primaryColor,
        opacity: 0.12
      }];

    }
    else if (buttonState == 'pressed') {
      button.fills = [{ type: 'SOLID', color: { r: Math.max(0, primaryColor.r - 0.2), g: Math.max(0, primaryColor.g - 0.2), b: Math.max(0, primaryColor.b - 0.2) } }];

    }

  } else if (buttonType == 'secondary') {
    if (buttonState == 'hover') {
      button.fills = [{
        type: 'SOLID',
        color: primaryColor,
        opacity: 0.12
      }];

    }
    else if (buttonState == 'pressed') {
      button.fills = [{ type: 'SOLID', color: { r: Math.max(0, primaryColor.r - 0.2), g: Math.max(0, primaryColor.g - 0.2), b: Math.max(0, primaryColor.b - 0.2) } }];

    }
    else if (buttonState == 'disabled') {
      button.strokes = [{ type: 'SOLID', color: primaryColor, opacity: 0.32 }];
      button.strokeWeight = 2;
    }

  }

  return button;
}
