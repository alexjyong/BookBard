import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import ePub from 'epubjs';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';

const App = () => {
  const [epubText, setEpubText] = useState('');

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

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

  const extractEpubText = async (filePath) => {
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Extracted EPUB Text:</Text>
      <Text>{epubText}</Text>
      <Button title="Pick EPUB File" onPress={pickDocument} />
    </View>
  );
};

export default App;