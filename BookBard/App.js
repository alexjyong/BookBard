import React, { useState } from 'react';
import { Button, View } from 'react-native';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import { Reader, ReaderProvider } from '@epubjs-react-native/core';

const App = () => {
  const [epubBase64, setEpubBase64] = useState(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // You might want to specify epub mime type here
      });

      if (result) {
        const base64 = await RNFS.readFile(result.uri, 'base64');
        setEpubBase64(base64);
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
    <View style={{ flex: 1 }}>
      <Button title="Pick an EPUB" onPress={pickDocument} />
      {epubBase64 && (
        <ReaderProvider>
          <Reader
            src={`data:application/epub+zip;base64,${epubBase64}`}
            flow="paginated" // or "scrolled"
            location={0}
            onLocationChange={(visibleLocation) => {
              console.log(visibleLocation);
            }}
            onReady={(book) => {
              console.log(book);
            }}
          />
        </ReaderProvider>
      )}
    </View>
  );
};

export default App;
