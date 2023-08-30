import React, { useState } from 'react';
import { StyleSheet, View, Button, Text, ScrollView, TextInput } from 'react-native';
import PDFView from 'react-native-pdf';
import { Reader, ReaderProvider } from '@epubjs-react-native/core';
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
        type: [DocumentPicker.types.pdf, DocumentPicker.types.plainText],
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

  return (
    <View style={styles.container}>
      <Button title="Select File" onPress={selectFile} />
      {fileType === 'pdf' && (
        <PDFView
          source={{ uri: fileUri, cache: true }}
          style={styles.pdfView}
        />
      )}
      {fileType === 'epub' && (
        <ReaderProvider>
          <Reader
            src={fileUri}
            width={300}
            height={400}
          />
        </ReaderProvider>
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
