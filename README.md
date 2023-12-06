# Web Chat SDK - Sample App

> [!IMPORTANT]
> Prior to installation and configuration, thoroughly review the [Official SDK Documentation](https://help.nice-incontact.com/content/acd/digital/chatsdk/getstartedchatwebsdk.htm).

## Quick Start Guide

To quickly start using the sample app, perform the following steps:

1. **Clone the Repository:**
   - Execute the command `git clone https://github.com/nice-devone/nice-cxone-chat-web-sample.git` to clone the project onto your local machine.

2. **Install Dependencies:**
   - Navigate to the cloned project's directory.
   - Run `npm install` to install the required dependencies.

3. **Environment Configuration:**
   - Locate the `.env.sample` file in the root directory.
   - Create a copy of this file and rename it to `.env`.
   - Populate the `.env` file with the necessary environment variables as per your project's requirements.

4. **Application Variant Selection:**
   - Choose which variant of the app you wish to run.
   - Assign the `REACT_APP_VARIANT` variable in your `.env` file to:
     - `MESSENGER` for a messaging-focused interface.
     - `LIVECHAT` for real-time customer support chat.
     - `MULTITHREAD` for handling multiple chat threads simultaneously.

5. **Starting the Application:**
   - Run the command `npm start` from the terminal.
   - Open a web browser and navigate to the URL output in the terminal to access the app.

## Understanding the Sample App Variants

Before selecting a variant, familiarize yourself with the differences by reading [Understanding the DFO Chat Channels](https://help.nice-incontact.com/content/acd/digital/chat/chatchannels.htm).

### Livechat

Livechat facilitates real-time interactions between customers and agents. Set up your Livechat variant by following the instructions in the [Set Up Digital First Omnichannel Live Chat](https://help.nice-incontact.com/content/acd/digital/chat/setuplivechat.htm) guide.

### Messenger

The Messenger variant allows for asynchronous communication, where contacts can send messages at any time and await responses. Set up the Messenger variant by consulting the [Set Up Digital First Omnichannel Chat Messaging](https://help.nice-incontact.com/content/acd/digital/chat/setupchatmessaging.htm) guide.

### Multithread

The Multithread variant supports multiple concurrent chat threads, enabling customers to engage in several chats at once, potentially with different agents. Set up is consistent with the Messenger variant, as detailed in the [Chat Messaging Setup](https://help.nice-incontact.com/content/acd/digital/chat/setupchatmessaging.htm).


## Enabling authorization flow


In the .env file, fill in the following variables:

```
REACT_APP_OAUTH_ENABLED=1
REACT_APP_OAUTH_PROVIDER_URL="https://example.com/oauth"
REACT_APP_OAUTH_REDIRECT_URI="https://localhost:3000"
REACT_APP_OAUTH_CLIENT_ID=clientId
```

This will enable the authorization flow. The authorization flow is triggered when the user clicks on the login button. 
The user will be redirected to the authorization provider URL. 
After the user logs in, the authorization provider will redirect the user back to the redirect URI. 
The redirect URI will contain the authorization code in the query string. 
The authorization code will be exchanged for an access token. The access token will be used to authenticate the user.

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), providing a robust foundation for React application development.
