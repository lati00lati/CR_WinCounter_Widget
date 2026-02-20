# Clash Royale Win Counter Widget v1.0.2
Automatically updates a win/loss counter for your stream, with very simple setup.

## Downloading Widget
Downloading via link is far simpler. However, if you'd like to add the widget in an existing widget, you can manually copy the sections over.

**Via Link**
1. Click the following link and sign-in ➜ https://seapi.c4ldas.com.br/overlays/install/1771565693241

**Manually**
1. Head to your StreamElements Overlay's ➜ https://streamelements.com/dashboard/overlays
2. Create a new Overlay (New Overlay ➜ Start)
3. Add a Custom Widget (Click the blue '+' icon in the bottom left corner ➜ Static/Custom ➜ Custom Widget)
4. Copy each file and paste it in the corresponding tab (ie. HTML in the HTML tab)
5. [Optional] Delete everything within the top and bottom brackets { } in the 'fields' section of the widget.

## Setup
1. Open the widget editor (If it's not already open)
2. Click into **Layers ➜ Custom widget 1 ➜ Settings ➜ Settings**.
3. Locate the 'Accounts Tags' text box. Put your Clash Royale Tag in that box.
4. Click Save (Top right)  

View [Multiple Accounts](#multiple-accounts) if you need to track more than 1 account.

## Adding Widget to OBS
1. In OBS, create a new 'Browser Source'
2. In the StreamElements Overlay menu (NOT the Widget Editor), click the 3 dots in the bottom left corner of the widget, and press 'Copy URL'
3. Paste the copied URL into the Browser Source URL on OBS.
4. Set the Browser Source width to 1920 and the height to 1080.
5. [Optional] Crop the source by holding ALT whild adjusting the boundaries of the widget.

## Multiple Accounts
By default, the API limits you to one account subscription. To track more accounts at once, you need to obtain a Clash Royale API token.
1. Open https://developer.clashroyale.com/#/
2. Login or Register
3. Click 'My Account' from the dropdown in the top right.
4. Create a New Key
5. Add the IP '212.192.28.75' to the token. Give it a name and description.
6. Save the key.
7. Copy the full token
8. Open the widget's settings (View [Setup](#setup) for instructions)
9. Paste the token in the 'Clash Royale API Key' box
10. Add the rest of your account tags to the 'Accounts Tags' text box. Separate each with a comma. Example: `#48GJ5KE, #9kgjn5, #84TkmeE`

## Variables
{wins} - Displays the number of wins  
{losses} - Displays the number of losses  
{streak} - Displays the win streak  
&lt;br&gt; - Acts as a newline.
 
## Warnings
Feel free to connect to the API for small personal projects, or customize the widget to your liking.
- Max 1 WebSocket connection per IP
- Max 1 WebSocket subscription without a Clash Royale Token
- Max 40 WebSocket subscriptions with a Clash Royale Token
- Abuse of the API will result in a permanent IP ban

## Contact
For feature requests, assistance with setup, or problems, feel free to create an issue (preferred) or message 'lati00lati' on Discord.
