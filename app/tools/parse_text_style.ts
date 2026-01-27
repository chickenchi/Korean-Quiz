interface TextPart {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean; // 밑줄 추가
  sub?: boolean;
  sup?: boolean;
  // 추가 시 위치
}

export const parseTextStyle = (text: string): TextPart[] => {
  const rules = [
    { pattern: /\/\*(.*?)\*\//g, key: "bold" },     
    { pattern: /\/(?!\*)(.*?)\//g, key: "italic" },  
    { pattern: /_(?!\()([^_]+)_/g, key: "underline" },
    { pattern: /\^\((.*?)\)/g, key: "sup" },         
    { pattern: /_\((.*?)\)/g, key: "sub" },
    // 추가 시 위치
  ];

  let charStyles = text.split("").map((char) => ({
    char,
    bold: false,
    italic: false,
    underline: false,
    sub: false,
    sup: false,
    // 추가 시 위치
    removed: false,
  }));

  rules.forEach(({ pattern, key }) => {
    let match;
    const regex = new RegExp(pattern.source, "g");

    while ((match = regex.exec(text)) !== null) {
      const fullMatch = match[0];
      const innerText = match[1];
      const start = match.index;
      const end = start + fullMatch.length;

      const openTagLen = fullMatch.indexOf(innerText);
      const closeTagLen = fullMatch.length - openTagLen - innerText.length;

      for (let i = start; i < end; i++) {
        if (i < start + openTagLen || i >= end - closeTagLen) {
          charStyles[i].removed = true;
        } else {
          (charStyles[i] as any)[key] = true;
        }
      }
    }
  });

  const result: TextPart[] = [];
  let currentPart: TextPart | null = null;

  charStyles.forEach((item) => {
    if (item.removed) return;

    if (
      currentPart &&
      currentPart.bold === item.bold &&
      currentPart.italic === item.italic &&
      currentPart.underline === item.underline &&
      currentPart.sub === item.sub &&
      currentPart.sup === item.sup
      // 추가 시 위치
    ) {
      currentPart.text += item.char;
    } else {
      currentPart = {
        text: item.char,
        bold: item.bold,
        italic: item.italic,
        underline: item.underline,
        sub: item.sub,
        sup: item.sup,
        // 추가 시 위치
      };
      result.push(currentPart);
    }
  });

  return result;
};