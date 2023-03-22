
async function createTextNode(params: { content: string, font: FontName, fontSize: number, x: number, y: number }): Promise<TextNode> {
  // Create a new text node
  const newTextNode = figma.createText()
  await figma.loadFontAsync(params.font)
  newTextNode.fontName = params.font
  newTextNode.fontSize = params.fontSize
  newTextNode.characters = params.content
  newTextNode.x = params.x
  newTextNode.y = params.y

  return newTextNode
}

function createSeparatorLineNode(frameWidth: number, xOffset: number, yOffset: number) {
  const separatorLineNode = figma.createLine();
  separatorLineNode.resize(frameWidth - (xOffset * 2), 0);
  separatorLineNode.x = xOffset;
  separatorLineNode.y = yOffset + 10;
  separatorLineNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  separatorLineNode.strokeWeight = 5;
  return separatorLineNode;
}

function setNodeProperties(newTextNode: TextNode, width: number, height: number, x: number, y: number, alignHorizontal: TextNode["textAlignHorizontal"]): void {
  newTextNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]
  newTextNode.textAlignHorizontal = alignHorizontal !== null? alignHorizontal: 'LEFT'
  newTextNode.textAlignVertical = 'CENTER'
  newTextNode.resize(width, height)
  newTextNode.x = x
  newTextNode.y = y
}

export {
  createTextNode,
  createSeparatorLineNode,
  setNodeProperties
}
