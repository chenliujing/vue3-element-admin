/**
 * 文件转换base64码
 * @param {文件} file
 * @returns
 */
export const fileConvertBase64 = (file: File, callback: any) => {
  setTimeout(() => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const base64 = e.target!.result;
      callback(base64);
    };
  }, 10);
};
