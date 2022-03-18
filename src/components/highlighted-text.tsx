import { Box, Text } from 'ink';
import React, { useMemo } from 'react';

interface HighlightedTextParams {
  text: string;
  color?: 'white' | 'blue' | 'green' | 'yellow' | 'red' | 'green';
}

export const HighlightedText: React.FC<HighlightedTextParams> = ({ text, color }) => {
  const annotatedText = useMemo(() => {
    const tokens = String(text).split('"');
    return tokens.map((token, index) => {
      const colored =
        text.includes(` "${token}" `) ||
        (index === 1 && text.includes(`"${token}" `)) ||
        (index === tokens.length - 2 && text.includes(` "${token}"`));
      return { text: token, colored };
    });
  }, [text]);

  return (
    <Box>
      {annotatedText.map((item, index) =>
        item.colored ? (
          <Text key={index} color={color}>
            {item.text}
          </Text>
        ) : (
          <Text key={index}>{item.text}</Text>
        )
      )}
    </Box>
  );
};

HighlightedText.defaultProps = {
  color: 'white'
};
