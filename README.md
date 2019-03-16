# DVMquizbuilder
A quiz building app, built on Django 2.1.5, for APOGEE 2019 at BITS Pilani

### How to setup application - 
1. Install pip - 
`~$ sudo apt-get install python3-pip`
2. Create the virtualenvironment - 
`~$ python3 -m venv /path/to/desired/virtual/environment/directory`
3. Activate the environment - 
`~$ source /path_of_venv/bin/activate`
4. Install django - 
`~$ pip3 install django`
5. Install pillow and django-allauth - 
`~$ pip3 install Pillow`
`~$ pip3 install django-allauth`
6. Clone this repository in the venv directory. Then navigate to the directory - 
`~$ cd DVMquizbuilder`
7. Create a superuser - 
`~$ python manage.py createsuperuser`
7. Run the server - 
`~$ python manage.py runserver`

If you are unable to get google login to work, login from the admin panel (relative url - /admin). You can log in using your superuser credentials. Once logged in, redirect back to the main url (127.0.0.1:8000). It will work then.


### How to setup google login - 
For social login, we are using django-allauth. Assuming you already have your project credentials set up (if not, get your api credentials [here](https://console.developers.google.com/)), to setup the api with django do the following - 
1. Create a superuser and log in to the admin panel.
2. Click on **Sites**. Then click on example.com
3. In domain name, replace example.com with 127.0.0.1:8000. Write whatever you want in display name (I prefer *DVMquizbuilder*) and click save.
4. Now go back to the admin panel and click on **Social applications**. Then click on **ADD SOCIAL APPLICATION**.
5. In Provider, select Google and set the name to "Login" (for simplicity). Paste your client id and client secret in the respective boxes.
6. Put "1" in key (I don't know if this is required).
7. In Sites, add 127.0.0.1:8000 to chosen sites and click save.

Google login should work well after this.

**Note**: If you're already logged in in your browser with a single google account, allauth will automatically log you in without asking for google credentials.
