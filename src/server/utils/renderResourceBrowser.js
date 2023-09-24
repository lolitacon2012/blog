const folderIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
<path fill-rule="evenodd" clip-rule="evenodd" d="M1 4C1 2.34315 2.34315 1 4 1H7.76393C8.90025 1 9.93904 1.64201 10.4472 2.65836L11.3416 4.44721C11.511 4.786 11.8573 5 12.2361 5H20C21.6569 5 23 6.34315 23 8V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V8C21 7.44772 20.5523 7 20 7H12.2361C11.0998 7 10.061 6.35799 9.55279 5.34164L8.65836 3.55279C8.48897 3.214 8.1427 3 7.76393 3H4Z" fill="#0F0F0F"/>
</svg>`;

const fileIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6 1C4.34315 1 3 2.34315 3 4V20C3 21.6569 4.34315 23 6 23H18C19.6569 23 21 21.6569 21 20V8.82843C21 8.03278 20.6839 7.26972 20.1213 6.70711L15.2929 1.87868C14.7303 1.31607 13.9672 1 13.1716 1H6ZM5 4C5 3.44772 5.44772 3 6 3H12V8C12 9.10457 12.8954 10 14 10H19V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V4ZM18.5858 8L14 3.41421V8H18.5858Z" fill="#0F0F0F"/>
</svg>`;

const generateItem = (url, title, isFolder) => {
  return `<a class='resource-item' href="${isFolder ? url : `/assets${url}`}"${
    isFolder ? "" : ' target="_blank" rel="noreferrer noopener"'
  }>${isFolder ? folderIcon : fileIcon}${title}</a>`;
};

module.exports = {
  generateItem,
};
