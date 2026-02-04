import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FormattedTextComp = ({ text }: { text: string }) => {
  if (!text || typeof text !== 'string') return null;

  const lines = text.split('\n');
console.log("text",text);

  return (
    <View style={styles.container}>
      {lines.map((rawLine, index) => {
        const line = rawLine.trim();
        if (!line) return null;

        // --- Divider
        if (line === '---') {
          return <View key={index} style={styles.divider} />;
        }

        // **Bold Heading**
        const boldHeading = line.match(/^\*\*(.+?)\*\*$/);
        if (boldHeading) {
          return (
            <Text key={index} style={styles.heading}>
              {boldHeading[1]}
            </Text>
          );
        }

        // **Title:** paragraph
        const boldTitleWithText = line.match(/^\*\*(.+?)\*\*:(.*)$/);
        if (boldTitleWithText) {
          return (
            <View key={index} style={styles.section}>
              <Text style={styles.title}>{boldTitleWithText[1]}</Text>
              {boldTitleWithText[2]?.trim() ? (
                <Text style={styles.paragraph}>
                  {boldTitleWithText[2].trim()}
                </Text>
              ) : null}
            </View>
          );
        }

        // 🔹 Bullet points (* or •)
        if (line.startsWith('*')) {
          return (
            <View key={index} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.paragraph}>
                {line.replace(/^\*\s*/, '')}
              </Text>
            </View>
          );
        }

        // Title: value (normal colon)
        if (line.includes(':')) {
          const [title, ...rest] = line.split(':');
          return (
            <View key={index} style={styles.section}>
              <Text style={styles.title}>{title.trim()}</Text>
              <Text style={styles.paragraph}>{rest.join(':').trim()}</Text>
            </View>
          );
        }

        // Default paragraph
        return (
          <Text key={index} style={styles.paragraph}>
            {line}
          </Text>
        );
      })}
    </View>
  );
};

export default FormattedTextComp;

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  heading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2A5BDA',
    marginTop: 12,
    marginBottom: 6,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
  },
  paragraph: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 6,
    lineHeight: 18,
  },
  section: {
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  bullet: {
    fontSize: 12,
    marginRight: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#DDD',
    marginVertical: 10,
  },
});
