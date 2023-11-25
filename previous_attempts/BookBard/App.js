import React, {useState} from 'react';
import {SafeAreaView, Button, useWindowDimensions, Alert} from 'react-native';
import {Reader, ReaderProvider} from '@epubjs-react-native/core';
import {useFileSystem} from '@epubjs-react-native/file-system';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';

export default function App() {
  const {width, height} = useWindowDimensions();
  const [epubSrc, setEpubSrc] = useState(null);
  const fileSystem = useFileSystem();

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: ['application/epub+zip'],
      });

      if (result) {
        const base64 = await RNFS.readFile(result.uri, 'base64');
        const first10Chars = base64.substring(0, 10);

        Alert.alert('Alert Title', `${first10Chars}`, [
          {
            text: 'ok',
          },
        ]);
        setEpubSrc(base64);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        throw err;
      }
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Button title="Pick an EPUB" onPress={pickDocument} />
      {epubSrc && (
        <ReaderProvider>
          <Reader
            src={epubSrc}
            width={width}
            height={height}
            fileSystem={fileSystem}
          />
        </ReaderProvider>
      )}
    </SafeAreaView>
  );
}
