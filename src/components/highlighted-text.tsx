import React, { useMemo } from 'react';
import { Text, Color, ColorProps, Box } from 'ink';
import { getAnnotatedText } from '../helpers';

interface HighlightedTextParams {
  text: string;
  color?: keyof Pick<ColorProps, 'white' | 'blue' | 'green' | 'yellow' | 'red' | 'green'>;
}

export const HighlightedText: React.FC<HighlightedTextParams> = ({ text, color }) => {
  const annotatedText = useMemo(() => getAnnotatedText(text), [text]);

  return (
    <Box>
      {annotatedText.map((item, index) =>
        item.colored ? (
          <Color key={index} keyword={color}>
            {item.text}
          </Color>
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
