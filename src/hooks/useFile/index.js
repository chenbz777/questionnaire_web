
const fileIcon = {
  file: 'data:image/png;base64,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',
  word: 'data:image/png;base64,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',
  excel: 'data:image/png;base64,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',
  ppt: 'data:image/png;base64,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',
  pdf: 'data:image/png;base64,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',
  image: 'data:image/png;base64,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'
};

const fileSuffixToFileIcon = {
  'pdf': 'pdf',
  'doc': 'word',
  'docx': 'word',
  'xls': 'excel',
  'xlsx': 'excel',
  'ppt': 'ppt',
  'pptx': 'ppt',
  'zip': 'zip',
  'rar': 'zip',
  '7z': 'zip',
  'txt': 'txt',
  'jpg': 'image',
  'jpeg': 'image',
  'png': 'image',
  'gif': 'image',
  'bmp': 'image',
  'mp3': 'audio',
  'wav': 'audio',
  'wma': 'audio',
  'mp4': 'video',
  'avi': 'video',
  'rmvb': 'video',
  'rm': 'video',
  'flv': 'video',
  'swf': 'video',
  'wmv': 'video'
};

// 获取文件类型
function getFileTypeByFileName(fileName) {
  const suffix = fileName.split('.').pop();

  return fileSuffixToFileIcon[suffix] || 'file';
}

// 获取文件图标
function getFileIconByFileName(fileName) {

  const type = getFileTypeByFileName(fileName);

  if (fileIcon[type]) {
    return fileIcon[type];
  }

  return fileIcon['file'];
}

export default function useFile() {
  return {
    getFileIconByFileName
  };
}