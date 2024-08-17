import 'mocha';
import fs from 'node:fs';
import path from 'node:path';
import { expect } from 'chai';
import { htmlFileGenerator } from '@/common/tools';

type firefoxBookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode & { type: 'bookmark' | 'folder' | 'separator'; children?: firefoxBookmarkTreeNode[] };

function readFile(htmlName: string) {
  const __dirname = import.meta.dirname;
  return fs.readFileSync(path.resolve(__dirname, `./expected/${htmlName}.html`), 'utf-8');
}

describe('tools/htmlFileGenerator', function () {
  const simpleNode: chrome.bookmarks.BookmarkTreeNode[] = [
    {
      id: '1',
      index: 0,
      parentId: '0',
      title: 'Bookmarks bar',
      dateAdded: 1543251918305,
      dateGroupModified: 1715253428187,
      children: [
        {
          id: '10001',
          parentId: '1',
          index: 0,
          dateAdded: 1662359122122,
          title: 'Google',
          url: 'https://www.google.com/',
        },
      ],
    },
  ];

  it('simple', async function () {
    const res = await htmlFileGenerator(simpleNode, {});
    const expected = readFile('simple');
    expect(res).to.be.eq(expected);
  });

  it('simple with includeIcon', async function () {
    const res = await htmlFileGenerator(simpleNode, {
      includeIcon: true,
    });
    const expected = readFile('includeIcon');
    expect(res).to.be.eq(expected);
  });

  it('simple with includeDate', async function () {
    const res = await htmlFileGenerator(simpleNode, {
      includeDate: true,
    });
    const expected = readFile('includeDate');
    expect(res).to.be.eq(expected);
  });

  const folderNode: chrome.bookmarks.BookmarkTreeNode[] = [
    {
      id: '1',
      index: 0,
      parentId: '0',
      title: 'Bookmarks bar',
      dateAdded: 1543251918305,
      dateGroupModified: 1715253428187,
      children: [
        {
          id: '10001',
          parentId: '1',
          index: 0,
          dateAdded: 1662359122122,
          title: 'Google',
          url: 'https://www.google.com/',
        },
        {
          id: '10002',
          parentId: '1',
          index: 1,
          title: 'Folder',
          dateAdded: 1662359121159,
          dateGroupModified: 1662359122124,
          children: [
            {
              id: '10003',
              parentId: '10002',
              index: 0,
              dateAdded: 1718018419639,
              title: 'GitHub',
              url: 'https://github.com/',
            },
          ],
        },
      ],
    },
  ];

  it('folder', async function () {
    const res = await htmlFileGenerator(folderNode, {});
    const expected = readFile('folder');
    expect(res).to.be.eq(expected);
  });

  it('folder with includeDate', async function () {
    const res = await htmlFileGenerator(folderNode, {
      includeDate: true,
    });
    const expected = readFile('folderIncludeDate');
    expect(res).to.be.eq(expected);
  });

  it('folder with noParentFolders', async function () {
    const res = await htmlFileGenerator(folderNode, {
      noParentFolders: true,
    });
    const expected = readFile('noParentFolders');
    expect(res).to.be.eq(expected);
  });

  const otherNode: chrome.bookmarks.BookmarkTreeNode[] = [
    {
      id: '1',
      index: 0,
      parentId: '0',
      title: 'Bookmarks bar',
      dateAdded: 1543251918305,
      dateGroupModified: 1715253428187,
      children: [
        {
          id: '10001',
          parentId: '1',
          index: 0,
          dateAdded: 1662359122122,
          title: 'Google',
          url: 'https://www.google.com/',
        },
        {
          id: '10002',
          parentId: '1',
          index: 1,
          title: 'Folder',
          dateAdded: 1662359121159,
          dateGroupModified: 1662359122124,
          children: [
            {
              id: '10003',
              parentId: '10002',
              index: 0,
              dateAdded: 1718018419639,
              title: 'GitHub',
              url: 'https://github.com/',
            },
          ],
        },
      ],
    },
    {
      id: '2',
      index: 1,
      dateAdded: 1543251918305,
      dateGroupModified: 1682310070383,
      parentId: '0',
      title: 'Other bookmarks',
      children: [
        {
          id: '11001',
          parentId: '2',
          index: 0,
          dateAdded: 1718019712232,
          title: 'Home / X',
          url: 'https://x.com/home',
        },
      ],
    },
  ];

  it('other', async function () {
    const res = await htmlFileGenerator(otherNode, {});
    const expected = readFile('other');
    expect(res).to.be.eq(expected);
  });

  it('other with noOtherBookmarks', async function () {
    const res = await htmlFileGenerator(otherNode, {
      noOtherBookmarks: true,
    });
    const expected = readFile('noOtherBookmarks');
    expect(res).to.be.eq(expected);
  });

  const firefoxNode: firefoxBookmarkTreeNode[] = [
    {
      id: 'menu________',
      title: 'Bookmarks Toolbar',
      dateAdded: 1700284756702,
      dateGroupModified: 1700284756794,
      index: 0,
      parentId: 'root________',
      type: 'folder',
      children: [
        {
          id: 'cojpCOyb0lMS',
          parentId: 'menu________',
          index: 0,
          dateAdded: 1700284756794,
          title: 'About',
          url: 'https://www.mozilla.org/about/',
          type: 'bookmark',
        },
      ],
    },
    {
      id: 'toolbar_____',
      title: 'Bookmarks Menu',
      dateAdded: 1700284756702,
      dateGroupModified: 1700284756794,
      index: 1,
      parentId: 'root________',
      type: 'folder',
      children: [
        {
          id: 'oztVbdoL7i-c',
          parentId: 'toolbar_____',
          index: 0,
          dateAdded: 1723884832518,
          title: 'Google',
          url: 'https://www.google.com/',
          type: 'bookmark',
        },
        {
          id: 'ikoBYA5wHzXP',
          parentId: 'toolbar_____',
          index: 1,
          dateAdded: 1723896319613,
          title: '',
          url: 'data:',
          type: 'separator',
        },
        {
          id: 'djobiKNRfCZh',
          parentId: 'toolbar_____',
          index: 2,
          dateAdded: 1700284756802,
          title: 'GitHub',
          url: 'https://github.com/',
          type: 'bookmark',
        },
      ],
    },
  ];

  it('firefox separator', async function () {
    const res = await htmlFileGenerator(firefoxNode, { includeDate: true });
    const expected = readFile('firefoxSeparator');
    expect(res).to.be.eq(expected);
  });
});
