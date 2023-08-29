import React, { useState } from 'react';
import { StyleSheet, View, Button, Text, ScrollView, TextInput } from 'react-native';
import PDFView from 'react-native-pdf';
import EpubViewer from 'react-native-epub-viewer';
import { request, PERMISSIONS } from 'react-native-permissions';
import DocumentPicker from 'react-native-document-picker';

const App = () => {
  const [fileUri, setFileUri] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  const selectFile = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.plainText], // This will allow selection of PDF and EPUB
      });
      setFileUri(result.uri);
      setFileType(result.type === 'application/pdf' ? 'pdf' : 'epub');
      addLog(`Selected file from: ${result.uri}`);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        addLog('File selection was cancelled.');
      } else {
        addLog(`Error selecting file: ${err.message}`);
        throw err;
      }
    }
  };

  const openFile = () => {
    if (fileType === 'pdf') {
      // Render PDF using PDFView
    } else if (fileType === 'epub') {
      EpubViewer.open(fileUri);
      EpubViewer.on('error', (error) => {
        addLog(`EPUB error: ${error.message}`);
      });
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Select File" onPress={selectFile} />
      {fileType === 'pdf' && (
        <PDFView
          source={{ uri: fileUri, cache: true }}
          style={styles.pdfView}
        />
      )}
      <Button title="Open File" onPress={openFile} />
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
