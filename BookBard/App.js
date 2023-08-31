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
      const result = await DocumentPicker.pickSingle({
        type: ['application/epub+zip'],
      });

      if (result) {
        extractEpubText(result.uri);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('User cancelled the picker');
      } else {
        addLog(`${err}`);
        throw err;
      }
    }
  };

  const extractEpubText = async filePath => {
    try {
      // Log the file path for debugging
      addLog(`File Path: ${filePath}`);

      // Read the EPUB file
      const data = await RNFS.readFile(filePath, 'base64');
      addLog('File read successfully');

      const epubData = `data:application/epub+zip;base64,${data}`;
      const book = ePub(data);
      if (!book) {
        addLog('Failed to get book data');
        return;
      }
      addLog('EPUB book initialized');
      addLog(`${book}`);

      addLog(`Book title: ${book.package.metadata.title}`);
      addLog(`Number of sections: ${book.spine.length}`);

      // Get the first section (as an example)
      const section = book.spine.get(0);
      if (!section) {
        addLog('Failed to get section from EPUB book');
        return;
      }

      const contents = await section.load();
      if (!contents) {
        addLog('Failed to load contents from section');
        return;
      }

      const text = contents.textContent;

      // Set the extracted text to state
      setEpubText(text);
      addLog('EPUB text extracted successfully');
    } catch (error) {
      addLog(`Error: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text>Extracted EPUB Text:</Text>
        <Text>{epubText}</Text>
        <Button title="Pick EPUB File" onPress={pickDocument} />
      </View>
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
      <View style={styles.bottomSection}>
        <Button title="Copy Logs" onPress={copyLogsToClipboard} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logView: {
    flex: 2, // This will allow the logView to take up more space
    marginTop: 20,
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
