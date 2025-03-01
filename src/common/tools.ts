/**
 * Download text file.
 * @param content file content
 * @param filename filename
 * @param saveAs save as
 * @param completed callback function
 */
export function downloadTextFile(content: string, filename: string, saveAs?: boolean, completed?: () => void) {
  if (!filename.endsWith('.html')) {
    filename += '.html';
  }

  const exportBlob = new Blob([content], { type: 'text/html' });
  const downloadUrl = window.URL.createObjectURL(exportBlob);

  chrome.downloads.download(
    {
      url: downloadUrl,
      filename,
      saveAs,
    },
    () => {
      if (typeof completed === 'function') {
        completed();
      }
    }
  );
}

/**
 * Escape HTML characters.
 * @see https://www.cnblogs.com/daysme/p/7100553.html
 * @param html HTML content
 * @returns
 */
function htmlEncode(html: string) {
  let temp: HTMLDivElement | null = document.createElement('div');
  temp.textContent = html;
  const output = temp.innerHTML;
  temp = null;
  return output;
}

/**
 * Get image base64 code.
 * @see https://blog.csdn.net/DeMonliuhui/article/details/79731359
 * @param src image address
 * @param mime image MIME type
 * @returns
 */
function getImageBase64(src: string, mime: string): Promise<string> {
  try {
    let canvas: HTMLCanvasElement | null = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = src;
    return new Promise((resolve, reject) => {
      img.onload = () => {
        if (canvas && ctx) {
          canvas.width = 16;
          canvas.height = 16;
          ctx.drawImage(img, 0, 0, 16, 16);
          const dataURL = canvas.toDataURL('image/' + mime);
          resolve(dataURL);
        } else {
          const err = new Error('no canvas');
          console.warn(err);
          reject(err);
        }
        canvas = null;
      };
      img.onerror = err => {
        console.error(err);
        reject(err);
      };
    });
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
}

/**
 * Get link's icon.
 * @param url
 */
async function getIcon(url?: string) {
  if (import.meta.env == undefined) {
    // Skip in the automatic test environment
    return '';
  }

  if (url) {
    return (await getImageBase64(faviconURL(url), 'png')) || '';
  }
  return '';
}

export function faviconURL(u: string) {
  const url = new URL(chrome.runtime.getURL('/_favicon/'));
  url.searchParams.set('pageUrl', u);
  url.searchParams.set('size', '16');
  return url.toString();
}

async function traverse(
  arr: chrome.bookmarks.BookmarkTreeNode[],
  settings: Partial<Settings>,
  tabSpace = '',
  isNoOther = false,
  progressHandle: null | (() => void) = null
) {
  let html = '';
  const space = tabSpace + '    ';
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (item.children) {
      if (settings.noParentFolders && !['1', '2', 'menu________', 'toolbar_____', 'unfiled_____', 'mobile______'].includes(item.id)) {
        html += `${await traverse(item.children, settings, '', isNoOther, progressHandle)}`;
      } else if (settings.noOtherBookmarks && ['2', 'toolbar_____', 'unfiled_____', 'mobile______'].includes(item.id)) {
        html += `${await traverse(item.children, settings, '', true, progressHandle)}`;
      } else {
        html += `
${space}<DT><H3${
          settings.includeDate
            ? ' ADD_DATE="' +
              (item.dateAdded ? item.dateAdded.toString().slice(0, 10) : '0') +
              '"' +
              ' LAST_MODIFIED="' +
              (item.dateGroupModified ? item.dateGroupModified.toString().slice(0, 10) : '0') +
              '"'
            : ''
        }${item.id == '1' || item.id == 'toolbar_____' ? ' PERSONAL_TOOLBAR_FOLDER="true"' : ''}>${htmlEncode(item.title)}</H3>
${space}<DL><p>${await traverse(item.children, settings, space, isNoOther, progressHandle)}
${space}</DL><p>`;
      }
    } else {
      //! for Firefox
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((item as any).type === 'separator') {
        html += `
${settings.noParentFolders ? (isNoOther ? '    ' : '        ') : space}<HR>`;
      } else {
        html += `
${settings.noParentFolders ? (isNoOther ? '    ' : '        ') : space}<DT><A HREF="${item.url}"${
          settings.includeDate ? ' ADD_DATE="' + (item.dateAdded ? item.dateAdded.toString().slice(0, 10) : '0') + '"' : ''
        }${settings.includeIcon ? ' ICON="' + (await getIcon(item.url)) + '"' : ''}>${htmlEncode(item.title)}</A>`;
      }

      if (typeof progressHandle === 'function') {
        progressHandle();
      }
    }
  }

  return html;
}

export async function htmlFileGenerator(
  arr: chrome.bookmarks.BookmarkTreeNode[],
  settings: Partial<Settings>,
  progressHandle: null | (() => void) = null,
  progressCompleted: null | (() => void) = null
) {
  const header = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
`;
  const body = `<DL><p>${await traverse(arr, settings, '', false, progressHandle)}
</DL><p>
`;
  if (typeof progressCompleted === 'function') {
    progressCompleted();
  }
  return header + body;
}
