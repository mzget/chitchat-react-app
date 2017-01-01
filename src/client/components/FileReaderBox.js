"use strict";
const React = require("react");
const FileReaderInput = require("react-file-reader-input");
const handleChange = (e, results) => {
    results.forEach(result => {
        const [e, file] = result;
        // this.props.dispatch(uploadFile(e.target.result));
        console.log(`Successfully uploaded ${file.name}!`);
    });
};
exports.FileReaderBox = (props) => (React.createElement("div", null,
    React.createElement(FileReaderInput, { as: "binary", id: "my-file-input", onChange: handleChange },
        React.createElement("button", null, "Select a file!"))));
