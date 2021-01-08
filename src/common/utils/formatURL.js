/**
 * URL 转成JSON对象
 * @param url
 * @return object
 */

export const formatURL = (url) => {
  // 存放URL数组JSON对象
  let argsList = {};
  argsList.url = url.split('?')[0];
  let argsArr = url.split('?')[1].split('&');
  for (let i = 0; i < argsArr.length; i++) {
    let res = argsArr[i].split('=');
    argsList[res[0]] = res[1];
  }
  return argsList
};

