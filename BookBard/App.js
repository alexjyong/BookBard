import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Button, Text, ScrollView, Clipboard } from 'react-native';
import PDFView from 'react-native-pdf';
import Tts from 'react-native-tts';
import { request, PERMISSIONS } from 'react-native-permissions';
import DocumentPicker from 'react-native-document-picker';

const App = () => {
  const [textToRead, setTextToRead] = useState('');
  const [pdfUri, setPdfUri] = useState(null); // State to hold the selected PDF's URI
  const [logs, setLogs] = useState([]); // State to hold logs

  const addLog = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  const selectPDFFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      // Use result.uri
      
      const filePath = JSON.stringify(result[0].uri);
      setPdfUri(filePath); // Set the selected PDF's file path to state
      addLog(`Selected PDF from: ${filePath}`);
      addLog(`Result object contains: ${JSON.stringify(result, null, 2)}`);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        addLog('PDF selection was cancelled.');
      } else {
        addLog(`Error selecting PDF: ${err.message}`);
        throw err;
      }
    }
  };

  const copyLogsToClipboard = () => {
    Clipboard.setString(logs.join('\n'));
    addLog('Logs copied to clipboard.');
  };

  // Dummy function to extract text from PDF (you'll need a real method to extract text)
  const extractTextFromDocument = () => {
    // Extract text from your document
    const extractedText = "This is a sample text from the document.";
    setTextToRead(extractedText);
    addLog('Extracted text from the document.');
  };

  const handleReadText = () => {
    Tts.speak(textToRead);
    addLog('Started reading the text.');
  };

  const requestStoragePermission = async () => {
    const response = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    if (response === 'granted') {
      extractTextFromDocument();
    } else {
      addLog('Storage permission was denied.');
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
      <ScrollView style={styles.logView}>
        <TextInput
          style={{ height: '100%' }}
          multiline={true}
          editable={true} // Allow editing to select and copy
          onChangeText={(text) => {
            if (text !== logs.join('\n')) {
              // Reset logs if user tries to modify them
              setLogs(logs);
            }
          }}
          value={logs.join('\n')}
        />
      </ScrollView>
          <Button title="Copy Logs" onPress={copyLogsToClipboard} />
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
  logView: {
    marginTop: 20,
    width: '80%',
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
});

export default App;
