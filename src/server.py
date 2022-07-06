import json
from flask import Flask, jsonify, request

app = Flask(__name__)
@app.route('/')
def index():
    return "Hello World!"

@app.route('/api/banking')
def getBanking():
    return jsonify([{
        
    }])

@app.route('/api/login', methods=['POST'])
def login():
    record = json.loads(request.data)

    print(record)
    return jsonify([{
        "initialized": True,
        "loggedIn": True,
        "user": record['user'], 
        "id": "-1",
        "last_login": "Yesterday",
        "token": record['password'],
        "status": "Party hard!",
        "about_me": "Like to party hard.",
        "image": "http://cyberpunk2077-larp.de/images/logos/Samurai_Logo.webp",
      }])

@app.route('/api/posts')
def posts():
    return jsonify([
        {
            'id': 0,
            'name': "Max Lynch",
            'sponsored': False,
            'time': "12 m",
            'avatar': "https://pbs.twimg.com/profile_images/1318970727173885953/bln98FNj_400x400.jpg",
            'message': "Join a global community of web native developers!",
            'views': "",
            'online': True,
        },
        {
            'id': 1,
            'name': "Ben Sperry",
            'sponsored': True,
            'image': "https://ionicons.com/assets/img/meta/ionicons-og.png",
            'time': "1 h",
            'avatar': "https://pbs.twimg.com/profile_images/1328390491126308864/jHHgl5Dm_400x400.jpg",
            'message': "Check out all the cool IonIcons used on this IonicBook app!",
            'views': "",
            'online': False
        },
        {
            'id': 2,
            'name': "Matt Netkow",
            'sponsored': False,
            'time': "2 h",
            'avatar': "https://pbs.twimg.com/profile_images/1323383930150621187/GKc0nVzi_400x400.jpg",
            'message': "I help web developers build cross-platform Web Native apps.",
            'views': "",
            'online': False
        }
    ])

@app.route('/api/messages')
def messages():
    return jsonify([{
        'id': 0,
        'name': "Ionic Framework",
        'avatar': "http://cyberpunk2077-larp.de/images/logos/Samurai_Logo.webp",
        'message': "This is a test message. This is a test message. This is a test message. ",
        'last_message_sent': 3,
        'new_message_count': 2
    },
    {
        'id': 1,
        'name': "Capacitor JS",
        'avatar': "http://cyberpunk2077-larp.de/images/logos/Maelstrom_Logo.webp",
        'message': "",
        'last_message_sent': 9,
        'new_message_count': 0
    },
    {
        'id': 2,
        'name': "Max Lynch",
        'avatar': "http://cyberpunk2077-larp.de/images/logos/Tyger_Claw_Logo.webp",
        'message': "",
        'last_message_sent': 15,
        'new_message_count': 0
    },
    {
        'id': 3,
        'name': "Ben Sperry",
        'avatar': "http://cyberpunk2077-larp.de/images/logos/Voodoo_Boys_Logo.webp",
        'message': "",
        'last_message_sent': 27,
        'new_message_count': 0
    },
    {
        'id': 4,
        'name': "Matt Netkow",
        'avatar': "https://pbs.twimg.com/profile_images/1323383930150621187/GKc0nVzi_400x400.jpg",
        'message': "",
        'last_message_sent': 31,
        'new_message_count': 1
    },
    {
        'id': 5,
        'name': "Liam DeBeasi",
        'avatar': "https://pbs.twimg.com/profile_images/1105953692669366273/ZNK4lRAJ_400x400.jpg",
        'message': "",
        'last_message_sent': 41,
        'new_message_count': 0
    },
    {
        'id': 6,
        'name': "Mike Hartington",
        'avatar': "https://pbs.twimg.com/profile_images/1084993841898446849/DJ8XtR6L_400x400.jpg",
        'message': "",
        'last_message_sent': 47,
        'new_message_count': 0
    },
    {
        'id': 7,
        'name': "Adam Bradley",
        'avatar': "https://pbs.twimg.com/profile_images/909075942320025600/hfYqicUk_400x400.jpg",
        'message': "",
        'last_message_sent': 51,
        'new_message_count': 0
    },
    {
        'id': 8,
        'name': "Brody Kidd",
        'avatar': "https://pbs.twimg.com/profile_images/477539679567228928/JObyaUW__400x400.jpeg",
        'message': "",
        'last_message_sent': 53,
        'new_message_count': 0
    }
    ])

app.run(port=3000, debug=True)