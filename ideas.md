# Random Ideas I have while developing

1. At the minute, I'm not sure whether the classes Reddit uses things like the main body tend to change upon new releases, so I should create some API service that the extension can call on a weekly basis that provides the latest classes to block certain features and then store them into the extensions file storage

2. The users username can be retrieved from a cookie, this is not for user tracking, but more so that the user can select the block user profile feed option but still be able to access their own

3. Have an option not to block the main feed, but only allow post from 
certain subreddits to appear on it instead, potentially as a completely 
separate list, kind of a redundant feature in technicality since you can 
just unsub, but this offers a potentially quicker and more reversible 
solution


Note -> Popup component should be called index, options should be called options



#### TODO AO 21/08/2022

- Refresh in memory settings whenever settings are changed in options menu
- Add in functionality to enable and disable extension
- Make it so blocking user feeds doesnt block your own feed

-- DONE

## Nice to have
- Chat window appears over blocks creen
- Instead of no post showing up, replace it with a message
- Same as above but for comments instead
- Refresh reddit tab on settings change? could be annoying, will have to try it out
  otherwise, add a little paragraph mentioning you will need to refresh reddit for changes
  to take affect


## Current issues
- Doesn't seem to work when not signed in, possibly due to cookie functin
- Main feed block doesn't seem to go away after visiting a subreddit