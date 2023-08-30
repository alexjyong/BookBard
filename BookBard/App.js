import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  TextInput,
  Clipboard,
} from 'react-native';
import ePub from 'epubjs';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';

const App = () => {
  const [epubText, setEpubText] = useState('');
  const [logs, setLogs] = useState([]);

  const addLog = message => {
    setLogs(prevLogs => [...prevLogs, message]);
  };

  const copyLogsToClipboard = () => {
    Clipboard.setString(logs.join('\n'));
    addLog('Logs copied to clipboard.');
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.picksingle({
        type: ['application/epub+zip'],
      });
      addLog(`JSON.stringify(${result})`);

      if (result) {
        extractEpubText(result.uri);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('User cancelled the picker');
      } else {
        throw err;
      }
    }
  };

  const extractEpubText = async filePath => {
    // Read the EPUB file
    const data = await RNFS.readFile(filePath, 'base64');
    const epubData = `data:application/epub+zip;base64,${data}`;
    const book = ePub(epubData);

    // Get the first section (as an example)
    const section = book.spine.get(0);
    const contents = await section.load();
    const text = contents.textContent;

    // Set the extracted text to state
    setEpubText(text);
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Extracted EPUB Text:</Text>
      <Text>{epubText}</Text>
      <Button title="Pick EPUB File" onPress={pickDocument} />
      <ScrollView style={styles.logView}>
        <TextInput
          style={{height: '100%'}}
          multiline={true}
          editable={true}
          onChangeText={text => {
            if (text !== logs.join('\n')) {
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
