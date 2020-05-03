# News App

## Install and Deploy

For the server, install python3 and pip3. After that run command to install requirements:

```
pip3 install -r requirements.txt
```

With the server ready, go into the `client` folder and use yarn to run the `deploy` command:

```
yarn deploy
```

That will build the client, copy static files into the server, and then `rsync` the resulting artifacts to a server (currently `byroni.us`).

Once that is in place, the server runs on port 5000 after calling

```
python3 app.py
```
