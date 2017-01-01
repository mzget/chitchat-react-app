import * as React from 'react';
import * as FileReaderInput from 'react-file-reader-input';

const handleChange = (e, results) => {
    results.forEach(result => {
        const [e, file] = result;
        // this.props.dispatch(uploadFile(e.target.result));
        console.log(`Successfully uploaded ${file.name}!`);
    });
}

export const FileReaderBox = (props) => (
    <div>
        <FileReaderInput as="binary" id="my-file-input" onChange={handleChange}>
            <button>Select a file!</button>
        </FileReaderInput>
    </div>
);