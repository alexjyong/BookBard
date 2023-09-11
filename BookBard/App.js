import React, {useState} from 'react';
import {SafeAreaView, Button, useWindowDimensions} from 'react-native';
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
      const result = await DocumentPicker.pick({
        type: ['application/epub+zip'],
      });

      if (result) {
        const base64 = await RNFS.readFile(result.uri, 'base64');
        const blob = fileSystem.base64ToBlob(base64, 'application/epub+zip');
        const blobUrl = URL.createObjectURL(blob);
        setEpubSrc(blobUrl);
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
    <SafeAreaView>
      <ReaderProvider>
        <Reader
          src="https://s3.amazonaws.com/moby-dick/OPS/package.opf"
          width={width}
          height={height}
          fileSystem={useFileSystem}
        />
      </ReaderProvider>
    </SafeAreaView>
  );

  // return (
  //   <SafeAreaView style={{flex: 1}}>
  //     <Button title="Pick an EPUB" onPress={pickDocument} />
  //     {epubSrc && (
  //       <ReaderProvider>
  //         <Reader
  //           src={epubSrc}
  //           width={width}
  //           height={height}
  //           fileSystem={fileSystem}
  //         />
  //       </ReaderProvider>
  //     )}
  //   </SafeAreaView>
  // );
}
