import React, { useState } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import PDFView from 'react-native-pdf';
import Epub from 'epubjs-rn';
import Tts from 'react-native-tts';
import { request, PERMISSIONS } from 'react-native-permissions';

const App = () => {
  const [textToRead, setTextToRead] = useState('');

  // Dummy function to extract text from PDF/EPUB (you'll need a real method to extract text)
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
      <PDFView
        source={{ uri: 'http://www.pdf995.com/samples/pdf.pdf', cache: true }}
        style={styles.pdfView}
      />
      <Epub
        src={"https://s3.amazonaws.com/epubjs/books/moby-dick/OPS/package.opf"}
        flow={"paginated"}
        style={styles.epubView}
      />
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
  epubView: {
    width: 300,
    height: 400,
    marginBottom: 20,
  },
});

export default App;
