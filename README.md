# DVMquizbuilder
A quiz building app for APOGEE 2019 at BITS Pilani

### How to setup google login - 
For social login, we are using django-allauth. Assuming you already have your project credentials set up, to setup the api with django do the following - 
1. Create a superuser and log in to the admin panel.
2. Click on **Sites**. Then click on example.com
3. In domain name, replace example.com with 127.0.0.1:8000. Write whatever you want in display name (I prefer *DVMquizbuilder*) and click save.
4. Now go back to the admin panel and click on **Social applications**. Then click on **ADD SOCIAL APPLICATION**.
5. In Provider, select Google and set the name to "Login" (for simplicity). Paste your client id and client secret in the respective boxes.
6. Put "1" in key (I don't know if this is required).
7. In Sites, add 127.0.0.1:8000 to chosen sites and click save.

Google login should work well after this.

**Note**: If you're already logged in in your browser with a single google account, allauth will automatically log you in without asking for google credentials.
