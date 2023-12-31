import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Button, Text, ScrollView, Clipboard, Platform } from 'react-native';
import PDFView from 'react-native-pdf';
import Tts from 'react-native-tts';
import { request, PERMISSIONS } from 'react-native-permissions';
import DocumentPicker from 'react-native-document-picker';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    this.props.addLog(`Error occurred: ${error.toString()}`);
    this.props.addLog(`Error details: ${errorInfo.componentStack}`);
  }

  render() {
    if (this.state.hasError) {
      return <Text>Error occurred. Check logs for details.</Text>;
    }

    return this.props.children;
  }
}

const App = () => {
  const [textToRead, setTextToRead] = useState('');
  const [pdfUri, setPdfUri] = useState(null);
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  const takePersistablePermission = (uri) => {
    if (Platform.OS === 'android') {
      const contentResolver = android.content.Context.getContentResolver();
      const takeFlags = Intent.FLAG_GRANT_READ_URI_PERMISSION;
      contentResolver.takePersistableUriPermission(uri, takeFlags);
    }
  };

  const selectPDFFile = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      });
      const filePath = result.uri;
      addLog(`Selected PDF from: ${filePath}`);
      addLog(`Result object contains: ${JSON.stringify(result, null, 2)}`);
      takePersistablePermission(filePath);
      setPdfUri(filePath);
      
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
    <ErrorBoundary addLog={addLog}>
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
            editable={true}
            onChangeText={(text) => {
              if (text !== logs.join('\n')) {
                setLogs(logs);
              }
            }}
            value={logs.join('\n')}
          />
        </ScrollView>
        <Button title="Copy Logs" onPress={copyLogsToClipboard} />
      </View>
    </ErrorBoundary>
  );
}

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
