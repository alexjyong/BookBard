import React, { useState } from 'react';
import { Button, View, Text, Alert, StyleSheet } from 'react-native';
import PDFReader from 'react-native-pdf';
import TTS from 'react-native-tts';
import DocumentPicker from 'react-native-document-picker';

function App() {
  const [fileType, setFileType] = useState(null); // 'pdf' or 'epub'
  const [filePath, setFilePath] = useState(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.plainText], // You can add more file types if needed
      });
      if (result.type === 'application/pdf') {
        readPDF(result.uri);
      } else if (result.type === 'application/epub+zip') {
        readEPUB(result.uri);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('User cancelled document picker');
      } else {
        throw err;
      }
    }
  };

  const readPDF = (path) => {
    setFileType('pdf');
    setFilePath(path);
    // Here, you'd use pdf.js to extract text and then use TTS to read it
    // For simplicity, we're just displaying the PDF and using a placeholder for TTS
    TTS.speak('Reading PDF content...'); // Placeholder
  };

  const readEPUB = (path) => {
    setFileType('epub');
    setFilePath(path);
    // Here, you'd use epub.js within the WebView to render and extract text, then use TTS to read it
    // For simplicity, we're just displaying a message (you'd integrate epub.js in a real implementation)
    TTS.speak('Reading EPUB content...'); // Placeholder
  };

  return (
    <View style={styles.container}>
      <Button title="Pick a Document" onPress={pickDocument} />
      {fileType === 'pdf' && <PDFReader source={{ uri: filePath }} />}
      {fileType === 'epub' && <Text style={styles.epubPlaceholder}>Render EPUB here using epub.js</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  epubPlaceholder: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default App;
