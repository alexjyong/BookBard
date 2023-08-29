import React, { useState } from 'react';
import { StyleSheet, View, Button, Text, ScrollView, TextInput } from 'react-native';
import PDFView from 'react-native-pdf';
import Tts from 'react-native-tts';
import { request, PERMISSIONS } from 'react-native-permissions';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

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

const uriToBase64 = async (uri) => {
  try {
    const fileContent = await RNFS.readFile(uri, 'base64');
    return `data:application/pdf;base64,${fileContent}`;
  } catch (error) {
    console.error("Failed to convert URI to base64", error);
    return null;
  }
};

const App = () => {
  const [pdfUri, setPdfUri] = useState(null);
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  const selectPDFFile = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      });
      const base64String = await uriToBase64(result.uri);
      setPdfUri(base64String);
      addLog(`Selected PDF from: ${result.uri}`);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        addLog('PDF selection was cancelled.');
      } else {
        addLog(`Error selecting PDF: ${err.message}`);
        throw err;
      }
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
