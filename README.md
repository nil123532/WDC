# WDC Project

- Please install necessary libraries for the project that are listed in the package.json
- For Google Sign-Ins, since we do not have an actual domain registered, if you try to use the Google Login in a non-verified origin path (domain), it will not let you and come up as restricted. This is due to the recent change in Google which took place on May 30th. Please contact us for this so that we can authorize your doamin (for cs50) so the login works.
- The google login authorization may be buggy on cs50 due to unknown reasons, clearing browser cache may help.
- In addition, google related APIs may not be initialized properly (most likely due to scripts not running in the correct order, or running at all, or just cs50 compatability issues), pages may require a reload to properly load them.
- DO NOT USE INCOGNITO FOR THE WEBSITE, COOKIES DO NOT WORK ON IT AND THE WEBSITE WILL NOT FUNCTION PROPERLY SINCE IT RELIES ON COOKIES.
- Each time you log out of the website, a google tab will open. This is to ensure that if you were using a gmail account to link your calendar, then that linked gmail will be logged out. If you had a calendar linked, this tab will open and then close after signing out. If you did not have a calendar linked, the tab will open and stay opened unless you close it. This is again to ensure that the user's gmail account is safe and does not stay logged in in the background.
- Credentials for the ADMIN account are: EMAIL: wdcproj@gmail.com  PASSWORD : wdcproj123 
- 
