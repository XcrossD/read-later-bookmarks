chrome.action.onClicked.addListener((tab) => {
  console.log('icon clicked')
  let bookmarkTreeNodes = chrome.bookmarks.getTree((bookmarkTreeNodes) => {
    console.log(bookmarkTreeNodes)
  })
})