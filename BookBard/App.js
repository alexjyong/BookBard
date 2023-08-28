import React, { useState } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import PDFView from 'react-native-pdf';
import Tts from 'react-native-tts';
import { request, PERMISSIONS } from 'react-native-permissions';
import DocumentPicker from 'react-native-document-picker';

const App = () => {
  const [textToRead, setTextToRead] = useState('');
  const [pdfUri, setPdfUri] = useState(null); // State to hold the selected PDF's URI

  const selectPDFFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      setPdfUri(result.uri); // Set the selected PDF's URI to state
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        throw err;
      }
    }
  };

  // Dummy function to extract text from PDF (you'll need a real method to extract text)
  const extractTextFromDocument = () => {
    // Extract text from your document
    const extractedText = "This is a sample text from the document.";
    setTextToRead(extractedText);
  };

  const handleReadText = () => {
    Tts.speak(textToRead);
  };

  const requestStoragePermission = async () => {
    const response = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    if (response === 'granted') {
      extractTextFromDocument();
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Select PDF" onPress={selectPDFFile} />
      {pdfUri && (
        <PDFView
          source={{ uri: pdfUri, cache: true }}
          style={styles.pdfView}
        />
      )}
      <Button title="Request Permission and Extract Text" onPress={requestStoragePermission} />
      <Button title="Read Text" onPress={handleReadText} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfView: {
    width: 300,
    height: 400,
    marginBottom: 20,
  },
});

export default App;