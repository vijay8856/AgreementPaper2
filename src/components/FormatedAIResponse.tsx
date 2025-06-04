import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FormattedTextComp = ({ text }: { text: string }) => {
    const formatText = (inputText: string) => {
        if (!inputText || typeof inputText !== 'string') return null;

        const lines = inputText.split('\n').filter((line) => line.trim() !== '');

        return lines.map((line, index) => {
            // Match **Heading**: Content
            const headingMatch = line.match(/^\*\*(.+?)\*\*:(.*)$/);

            if (headingMatch) {
                const headingText = headingMatch[1].trim(); // text inside **
                const paragraphText = headingMatch[2].trim(); // text after colon

                return (
                    <View key={index} style={styles.section}>
                        <Text style={styles.heading}>{headingText}</Text>
                        {paragraphText ? (
                            <Text style={styles.paragraph}>{paragraphText}</Text>
                        ) : null}
                    </View>
                );
            }

            // Numbered headings e.g. "1. Heading"
            if (/^\d+\.\s/.test(line)) {
                return (
                    <Text key={index} style={styles.heading}>
                        {line}
                    </Text>
                );
            }

            // Lines with colon but no ** **
            if (line.includes(':')) {
                const [title, ...rest] = line.split(':');
                const content = rest.join(':').trim();

                return (
                    <View key={index} style={styles.section}>
                        <Text style={styles.title}>{title.trim()}:</Text>
                        <Text style={styles.paragraph}>{content}</Text>
                    </View>
                );
            }

            // Plain paragraph
            return (
                <Text key={index} style={styles.paragraph}>
                    {line}
                </Text>
            );
        });
    };

    return <View style={styles.container}>{formatText(text)}</View>;
};

export default FormattedTextComp;

const styles = StyleSheet.create({
    container: {
        padding: 5,
    },
    heading: {
        color: '#2A5BDA',

        fontWeight: 'bold',
        fontSize: 12,
        marginTop: 10,
        marginBottom: 4,
    },
    section: {
        marginTop: 0,
    },
    title: {
        
        fontSize: 10,
        fontWeight: 'bold',
    },
    paragraph: {
        fontWeight: 'bold',
        marginTop: 8,
        fontSize: 12,
        marginBottom: 6,
    },
});
