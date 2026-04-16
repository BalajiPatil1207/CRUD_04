# FileUpload Component Usage

A modern drag-and-drop file uploader with preview and multi-file support.

## Basic Usage

```jsx
import FileUpload from './components/common/FileUpload';

<FileUpload 
  label="Upload Profile Picture" 
  onChange={(files) => console.log(files)} 
  accept="image/*"
/>
```

## Multi-file support
Use `multiple={true}` to allow uploading more than one file.
